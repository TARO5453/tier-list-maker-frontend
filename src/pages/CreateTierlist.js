import React, { useState, useEffect, useMemo, useCallback, useRef} from 'react';
import { Container, Row, Col, Button, Alert, Card, Form, InputGroup, Modal, Dropdown, Spinner} from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { useDroppable } from "@dnd-kit/core";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import html2canvas from 'html2canvas';
import ExportTierlist from '../components/Tierlist/ExportTierlist';


/* 
    Some parts are generated from Deepseek AI
*/

// Private helper method for item component
function SortableItem({ id, item, isDragging }) {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1, // When users drag items, make it transparents.
    };

    return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{
        width: '100px',
        height: '100px',
        cursor: 'grab',
        border: '1px solid #ddd',
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        background: '#fff'
      }}>
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

// private helper method to register droppable areas
function DroppableContainer({ id, children, style }) {
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    data: {
      type: 'container',
      containerId: id
    }
  });
  
  return (
    <div 
      ref={setNodeRef} 
      style={{
        ...style,
        border: isOver ? '3px dashed #007bff' : 'none',
        outline: isOver ? '2px solid rgba(0, 123, 255, 0.3)' : 'none'
      }}
    >
      {children}
    </div>
  );
}

// Main component
function CreateTierlist() {

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { templateId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [template, setTemplate] = useState(null);

  // Map containerId to array of items 
  // Item = { id, name, imageUrl }
  const [containers, setContainers] = useState({
    // tiers
    tier_S: [],
    tier_A: [],
    tier_B: [],
    tier_C: [],
    tier_D: [],
    tier_F: [],
    // unselected area
    unranked: []
  });

  const [tiersMeta, setTiersMeta] = useState([
    { id: 'tier_S', label: 'S', color: '#ff6c03' },
    { id: 'tier_A', label: 'A', color: '#ffa449' },
    { id: 'tier_B', label: 'B', color: '#ffd34d' },
    { id: 'tier_C', label: 'C', color: '#ffff7f' },
    { id: 'tier_D', label: 'D', color: '#bfff7f' },
    { id: 'tier_F', label: 'F', color: '#7fff7f' }
  ]);

  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [newTierLabel, setNewTierLabel] = useState('');
  const [newTierColor, setNewTierColor] = useState('#cccccc');

  // DND kit sensors set up
  const sensors = useSensors(useSensor(PointerSensor));

  // Active dragging id for overlay
  const [activeId, setActiveId] = useState(null);

  // Map itemId to item object
  const itemsMap = useMemo(() => {
    const map = {};
    Object.values(containers).forEach(arr => {
      arr.forEach(it => { map[it.id] = it; });
    });
    return map;
  }, [containers]);

  // Add ref to capture tier list contents
  const tierlistRef = useRef(null);

  // Find container id that contains the itemId
  const findContainerForItem = useCallback((itemId) => {
    for (const [cid, items] of Object.entries(containers)) {
        if (items && items.some(it => it.id === itemId)) {
        return cid;
        }
    }
        return null;
    }, [containers]); // Add dependencies

  // Load template from backend
  useEffect(() => {
    async function loadTemplate() {
      try {
        setLoading(true);
        const res = await axios.get(`https://api.taro5453.com/api/templates/${templateId}`, {
                withCredentials: true
        });
        if (!res.data.success) {
          setError(res.data.message || 'Failed to load template');
          return;
        }
        const temp = res.data.template;
        setTemplate(temp);

        // Build the items and add them to unselected area
        const initialItems = temp.items.map((it, idx) => ({
          id: `item-${it.id}`,
          dbId: it.id,
          name: `Item ${idx + 1}`,
          imageUrl: it.imageUrl
        }));

        setContainers(prev => ({ ...prev, unranked: initialItems }));
      } catch (err) {
        setError('Failed to load template');
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [templateId]);

  // Handler for DND

  // Set active ID when the user holds an item. 
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // After the user dropped an item, add it to the correct area 
  const handleDragEnd = (event) => {
    // Active= before, Over = after
    const { active, over } = event;
    setActiveId(null);

    // If the user dropped in undroppable area
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find source container, where the item came from
    const sourceContainer = findContainerForItem(activeId);
    if (!sourceContainer) return;

    // Find destination container, where the user dropped an item
    let destContainer;
    
    // Check if the user is dropping directly on a container
    const isContainerId = Object.keys(containers).includes(overId);
    
    if (isContainerId) {
        destContainer = overId;
    } else {
        // Find which container it is in
        destContainer = findContainerForItem(overId);
    }
    
    // If container not found, then just put it back where it came from
    if (!destContainer) {
        destContainer = sourceContainer;
    }

    // Same container but the user changed the order
    if (sourceContainer === destContainer) {
        // Copy items from source container
        const items = [...containers[sourceContainer]];
        // Save old item index
        const oldIndex = items.findIndex(i => i.id === activeId);
        // Validation for when we cannot find the index
        if (oldIndex === -1) return;
        
        let newIndex;
        
        // If dropped on a container = add at the end of the row
        if (overId === destContainer) {
            newIndex = items.length - 1;
        } 
        else {
            // Dropping on another item
            newIndex = items.findIndex(i => i.id === overId);
            // Validation for when we cannot find the index
            if (newIndex === -1) newIndex = items.length - 1;
        }
        
        // If the destination isn't same as source
        // Move the item to the new index
        if (oldIndex !== newIndex && newIndex !== -1) {
        setContainers(prev => ({
            ...prev,
            [sourceContainer]: arrayMove(items, oldIndex, newIndex)
        }));
        }
        return;
    }

    // Move item to a different container
    setContainers(prev => {
        // Copy the items from source and destination containers
        const sourceItems = [...prev[sourceContainer]];
        const destItems = [...prev[destContainer]];
        
        // Save the old index
        const oldIndex = sourceItems.findIndex(i => i.id === activeId);
        if (oldIndex === -1) return prev;
        
        const [moved] = sourceItems.splice(oldIndex, 1);
        
        let newIndex;
        
        if (overId === destContainer) {
            // Drop on empty container
            newIndex = destItems.length;
        } else {
            // Drop on an item
            newIndex = destItems.findIndex(i => i.id === overId);
            // If index not found, add it at the end
            if (newIndex === -1) newIndex = destItems.length;
        }
        // Move the items
        destItems.splice(newIndex, 0, moved);
        
        return {
            ...prev,
            [sourceContainer]: sourceItems,
            [destContainer]: destItems
        };
    });
    };

    // Export tierlist as png
  const exportTierlist = async () => {
    try {
        setLoading(true);
        
        // Create a temporary div for export
        const exportDiv = document.createElement('div');
        exportDiv.style.position = 'absolute';
        exportDiv.style.left = '-9999px';
        exportDiv.style.width = '1200px'; 
        exportDiv.style.padding = '20px';
        exportDiv.style.backgroundColor = 'white';
        
        // Render the export content
        const exportContent = document.createElement('div');
        exportContent.innerHTML = `
        <div style="width: 100%; background: white;">
            ${ReactDOMServer.renderToStaticMarkup(
            <ExportTierlist
                tiersMeta={tiersMeta}
                containers={containers}
                template={template}
            />
            )}
        </div>
        `;
        
        exportDiv.appendChild(exportContent);
        document.body.appendChild(exportDiv);
        
        // Use html2canvas on the export content
        const canvas = await html2canvas(exportDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: 1200,
        height: exportDiv.scrollHeight,
        windowWidth: 1200,
        windowHeight: exportDiv.scrollHeight
        });
        
        // Clean up
        document.body.removeChild(exportDiv);
        
        // Convert to image and download
        const image = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        const fileName = `${template?.name || 'tierlist'}_${new Date().getTime()}.png`;
        link.download = fileName;
        link.href = image;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        //alert('Exported successfully!');
        
    } catch (error) {
        console.error('Error exporting tierlist:', error);
        setError('Failed to export tierlist. Please try again.');
    } finally {
        setLoading(false);
    }
};

  // Add row
  const addTier = () => {
    // Rows must have name
    if (!newTierLabel) return;
    const id = `tier_${Date.now()}`;

    setTiersMeta(prev => [...prev, { id, label: newTierLabel, color: newTierColor }]);
    setContainers(prev => ({ ...prev, [id]: [] }));
    setNewTierLabel('');
    setNewTierColor('#cccccc');
    setShowAddTierModal(false);
  };

  // Remove row
  const removeTier = (tierId) => {
    // move items in the row back to unselected area, then remove container and meta data
    setContainers(prev => {
      const newContainers = { ...prev };
      const moved = newContainers[tierId] || [];
      newContainers.unranked = [...(newContainers.unranked || []), ...moved];
      delete newContainers[tierId];
      return newContainers;
    });
    setTiersMeta(prev => prev.filter(t => t.id !== tierId));
  };

  // Rename row
  const renameTier = (tierId, newLabel) => {
    setTiersMeta(prev => prev.map(t => t.id === tierId ? { ...t, label: newLabel } : t));
  };

  // UI rendering
  if (loading) {
    return <Container className="text-center py-5"><Spinner animation="border" /></Container>;
  }

  // Active item for overlay
  const activeItem = activeId ? itemsMap[activeId] : null;

  return (
    <Container fluid className="mt-3">
      <Row className="mb-3">
        <Col>
          <h2>{template?.name || 'Create Tier List'}</h2>
          <p className="text-muted">Drag and drop items into tiers to rank them</p>
        </Col>
        <Col className="text-end">
          <Button variant="outline-secondary" className="me-2" onClick={() => navigate('/templates')}>Back</Button>
          <Button variant="primary" onClick={() => exportTierlist()}>Export</Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <div className="text-center py-3"><Spinner animation="border" /></div>}


      {/* Wrap the tierlist content in a div with ref */}
      <div ref={tierlistRef}>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* Rows */}
            <div className="mb-4">
            {tiersMeta.map(t => (
                <Card key={t.id} className="mb-3" style={{ borderLeft: `5px solid ${t.color}` }}>
                <Card.Body>
                    <Row className="align-items-center">
                    <Col xs={2} md={1}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Form.Control value={t.label} onChange={(e) => renameTier(t.id, e.target.value)}
                            style={{ backgroundColor: t.color, color: '#000', fontWeight: 'bold', textAlign: 'center', width: 80, height: 100, border: '1px solid #484c50ff', borderRight: 'none', borderRadius: '0.25rem 0 0 0.25rem'}}
                        />
                        <Dropdown>
                            <Dropdown.Toggle 
                            variant="outline-secondary" 
                            size="sm" 
                            style={{ backgroundColor: t.color, height: 100, width: 20, borderLeft: 'none', borderRadius: '0 0.25rem 0.25rem 0', border: '1px solid #484c50ff'}}
                            >
                
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            <Dropdown.Item onClick={() => removeTier(t.id)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        </div>
                    </Col>
                    {/* Show the items */}
                    <Col xs={10} md={11}>
                        <DroppableContainer id={t.id} style={{
                        minHeight: 100, backgroundColor: `${t.color}15`, borderRadius: 4, padding: 10, display: 'flex', flexWrap: 'wrap', gap: 10
                        }}>
                        <SortableContext items={(containers[t.id] || []).map(i => i.id)} strategy={rectSortingStrategy}>
                            {(containers[t.id] || []).map(it => (
                            <SortableItem key={it.id} id={it.id} item={it} isDragging={activeId === it.id} />
                            ))}
                        </SortableContext>
                        </DroppableContainer>
                    </Col>
                    </Row>
                </Card.Body>
                </Card>
            ))}
            </div>

            {/* Add row */}
            <div className="text-center mb-4">
            <Button variant="outline-secondary" onClick={() => setShowAddTierModal(true)}>+ Add Tier</Button>
            </div>

            {/* Unselected area */}
            <Card className="mb-4">
            <Card.Header><h5 className="mb-0">Unselected Items</h5></Card.Header>
            <Card.Body>
                <DroppableContainer id="unranked" style={{
                minHeight: 150, backgroundColor: '#f8f9fa', borderRadius: 4, padding: 15, display: 'flex', flexWrap: 'wrap', gap: 15
                }}>
                    {/* Show the items */}
                <SortableContext items={(containers.unranked || []).map(i => i.id)} strategy={rectSortingStrategy}>
                    {(containers.unranked || []).map(it => (
                    <SortableItem key={it.id} id={it.id} item={it} isDragging={activeId === it.id} />
                    ))}
                </SortableContext>
                </DroppableContainer>
            </Card.Body>
            </Card>

            {/* Drag overlay with item image */}
            <DragOverlay>
            {activeItem ? (
                <div style={{ width: 120, height: 120, borderRadius: 6, overflow: 'hidden', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
                <img src={activeItem.imageUrl} alt={activeItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ) : null}
            </DragOverlay>
        </DndContext>
      </div>

      {/* Pop up window for adding a new row */}
      <Modal show={showAddTierModal} onHide={() => setShowAddTierModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Tier</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tier label</Form.Label>
              <Form.Control type="text" value={newTierLabel} onChange={(e) => setNewTierLabel(e.target.value)} placeholder="S, A, B..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tier color</Form.Label>
              <Form.Control type="color" value={newTierColor} onChange={(e) => setNewTierColor(e.target.value)} style={{ height: 40 }} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddTierModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={addTier}>Add</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CreateTierlist;