import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Form, Spinner, Badge} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Templates() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch user's templates from backend
    useEffect(() => {
        getUserTemplates();
    }, []);

    const getUserTemplates = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://api.taro5453.com/api/templates/my', {
                withCredentials: true
        });
            setTemplates(response.data.templates || []);
        } catch (err) {
            setError('Failed to load templates');
        } finally {
            setLoading(false);
        }
    }
    const deleteTemplate = async (templateId) => {
        try {
            setLoading(true);
            const response = await axios.delete(`https://api.taro5453.com/api/templates/${templateId}`, {
                withCredentials: true
        });
            await getUserTemplates(); // Refresh list
        } catch (err) {
            setError('Failed to delete templates');
        } finally {
            setLoading(false);
        }
    }

    // Handle redirect buttons
    const handleTemplateClick = (templateId) => {
        navigate(`/create-tierlist/${templateId}`);
    };
    const handleTemplateDelete = async (templateId) => {
        await deleteTemplate(templateId);
    };
    const handleNewTemplate = () => {
        navigate('/new-template');
    };
    const handleSearchPublic = () => {
        navigate('/public-templates');
    };

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>My Templates</h2>
                    <p className="text-muted">Manage your tier list templates</p>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" className="me-2" onClick={handleNewTemplate}>
                        Create New Template
                    </Button>
                    <Button variant="outline-secondary" onClick={handleSearchPublic}>
                        Search Public Templates
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* If it's still loading, display the spinner.*/}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : templates.length === 0 ? (
                <Card className="text-center py-5">
                    <Card.Body>
                        <h5>No templates yet</h5>
                        <p className="text-muted">Create your first template to get started</p>
                    </Card.Body>
                </Card>
            ) : (
                <Row>
                    {templates.map((template) => (
                        <Col md={4} lg={3} className="mb-4" key={template.id}>
                            {/* If the user click on their templates, redirect them to create-tierlist page*/}
                            <Card 
                                className="h-100 shadow-sm hover-shadow" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleTemplateClick(template.id)}
                            >
                                {/* Display template thumbnails*/}
                                {template.thumbnail && (
                                    <Card.Img 
                                        variant="top" 
                                        src={template.thumbnail} 
                                        style={{ height: '150px', objectFit: 'cover' }}
                                    />
                                )}
                                {/* Display templates*/}
                                <Card.Body>
                                    <Card.Title>{template.name}</Card.Title>
                                    <Card.Text className="text-muted small">
                                        {template.description || 'No description'}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center mt-2">

                                        <div className="d-flex flex-column">
                                            <Badge bg={template.personal ? 'secondary' : 'success'} className="mb-1">
                                                {template.personal ? 'Private' : 'Public'}
                                            </Badge>
                                            <Badge bg='light' text="dark" className="mb-1">
                                                {template.category}
                                            </Badge>
                                        </div>

                                        <Button variant="outline-danger" size="sm" onClick={(e) => {
                                            e.stopPropagation(); // prevent card click
                                            handleTemplateDelete(template.id)
                                        }}>
                                             Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default Templates;