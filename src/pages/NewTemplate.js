import React, { useState } from 'react';
import { Container, Card, Button, Alert, Row, Col, Form} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewTemplate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'NONE',
        personal: true,
        images: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Handle text input 
    const handleChange = (e) => {
        // Use name as key
        const {name, value, type, checked} = e.target;
        // Functional update, gets prev state then returns the new state 
        setFormData(prev => ({
            ...prev, // ... means copy all fields
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
        
        // Preview thumbnail for the uploaded images
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    // Handle request form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('personal', formData.personal);
            
            // Add images
            imageFiles.forEach((file, index) => {
                formDataToSend.append('imageFiles', file);
            });

            // Send request to backend
            const response = await axios.post('https://api.taro5453.com/api/templates', formDataToSend, {
                headers: {'Content-Type': 'multipart/form-data'},
                withCredentials: true 
            });

            if (response.data.success) {
                // If the user successfully created a new template, redirect to Create Tier List page
                navigate(`/create-tierlist/${response.data.template.id}`);
            } else {
                setError('Error: ' + response.data.message);
            }
        } catch (err) {
            setError('Failed to create template. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // For cancel button
    const handleCancel = () => {
        navigate('/templates');
    };

    return(
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow">
                        <Card.Body className="p-4">

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="mb-0">Create New Template</h2>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            {/* Create tempalte form */}
                            <Form onSubmit={handleSubmit}>
                                {/* Template name textbox*/}
                                <Form.Group className="mb-3">
                                    <Form.Label>Template Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter a unique template name"
                                        required
                                    />
                                </Form.Group>
                                {/* Category options */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        <option value="NONE">None</option>
                                        <option value="GAME">Game</option>
                                        <option value="MOVIE">Movie</option>
                                        <option value="MUSIC">Music</option>
                                        <option value="NATURE">Nature</option>
                                        <option value="EDUCATION">Education</option>
                                        <option value="SPORT">Sport</option>
                                        <option value="TECHNOLOGY">Technology</option>
                                    </Form.Select>
                                </Form.Group>
                                {/* Description textbox*/}
                                <Form.Group className="mb-3">
                                    <Form.Label>Description (Optional)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe your template"
                                        rows={3}
                                    />
                                </Form.Group>
                                {/* Create tempalte form */}
                                <Form.Group className="mb-3">
                                    <Form.Label>Upload Images</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleImageChange}
                                        multiple
                                        accept="image/*"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Upload item images for the tier list
                                    </Form.Text>
                                </Form.Group>

                                {/* Image thumbnail preview */}
                                {imagePreviews.length > 0 && (
                                    <div className="mb-4">
                                        <p className="mb-2">Preview ({imagePreviews.length} images):</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {imagePreviews.map((preview, index) => (
                                                <img 
                                                    key={index}
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{
                                                        width: '80px',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '4px'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Template privacy */}
                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="switch"
                                        id="public-switch"
                                        label="Make template public"
                                        name="personal"
                                        checked={!formData.personal}
                                        onChange={e =>
                                            setFormData(prev => ({ 
                                                ...prev,
                                                 personal: !e.target.checked }))
                                        }
                                    />
                                    <Form.Text className="text-muted">
                                        Public templates can be discovered by other users
                                    </Form.Text>
                                </Form.Group>

                                {/* Submit button */}
                                <div className="d-flex gap-3">
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={loading}
                                        className="flex-grow-1"
                                    >
                                        {loading ? 'Creating...' : 'Create Template'}
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default NewTemplate;