import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Row, Col, Form, Spinner, Badge, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PublicTemplates() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('NONE');

    // list of categories
    const categories = ['NONE', 'GAME', 'MOVIE', 'MUSIC', 'NATURE', 'EDUCATION', 'SPORT', 'TECHNOLOGY'];

    useEffect(() => {
        getPublicTemplates();
    }, []);

    useEffect(() => {
        filterTemplates();
    }, [searchKeyword, selectedCategory, templates]);

    // fetch public templates from backend
    const getPublicTemplates = async () => {
        try {
            setLoading(true);
            const personal = false;
            const category = 'NONE';
            const response = await axios.get('https://api.taro5453.com/api/templates/all', {
                params: { category, personal }
            });
            // All templates
            setTemplates(response.data.templates || []);
            // Filtered templates
            setFilteredTemplates(response.data.templates || []);
        } catch (err) {
            setError('Failed to load public templates');
        } finally {
            setLoading(false);
        }
    };
    const filterTemplates = async () => {
        let filteredTemplates = templates;
        // Filter by keyword
        if (searchKeyword) {
            // Check substring in name and description
            filteredTemplates = filteredTemplates.filter(template =>
                template.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                template.description?.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }
        // Filter by category
        if (selectedCategory !== "NONE") {
            filteredTemplates = filteredTemplates.filter(template =>
                template.category === selectedCategory
            );
        }
        // Update filtered templates list
        setFilteredTemplates(filteredTemplates);
    };

    // Handle page redirect buttons
     const handleTemplateClick = (templateId) => {
        navigate(`/create-tierlist/${templateId}`);
    };
    const handleBack = () => {
        navigate('/templates');
    };
    
    return(
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Public Templates</h2>
                    <p className="text-muted">Browse and use templates created by others</p>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-secondary" onClick={handleBack}>
                        Back
                    </Button>
                </Col>
            </Row>

            {/* Searching section*/}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        {/* Searching text box*/}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Search Templates</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search by keyword"
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        {/*Category options*/}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Category Filter</Form.Label>
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            {/*If the page is still loading then displays loading spinner*/}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
                
            ) : filteredTemplates.length === 0 ? (
                <Card className="text-center py-5">
                    {/*No matched template found*/}
                    <Card.Body>
                        <h5>No templates found</h5>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    {/*Show number of matched templates*/}
                    <p className="text-muted mb-3">
                        Found {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                    </p>
                    <Row>
                        {/*Loop through the filtred templates list and display them*/}
                        {filteredTemplates.map((template) => (
                            <Col md={4} lg={3} className="mb-4" key={template.id}>
                                <Card 
                                    className="h-100 shadow-sm hover-shadow" 
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleTemplateClick(template.id)}
                                >
                                    {/*Show thumbnail*/}
                                    {template.thumbnail && (
                                        <Card.Img 
                                            variant="top" 
                                            src={template.thumbnail} 
                                            style={{ height: '150px', objectFit: 'cover' }}
                                        />
                                    )}
                                    {/*Show template info*/}
                                    <Card.Body>
                                        <Card.Title>{template.name}</Card.Title>
                                        <Card.Text className="text-muted small">
                                            {template.description || 'No description'}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Badge bg="info">{template.category}</Badge>
                                            <small className="text-muted">
                                                by {template.creator?.username ?? "Unknown"}
                                            </small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </Container>
    );
}

export default PublicTemplates;