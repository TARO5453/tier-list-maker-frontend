

const ExportTierlist = ({ tiersMeta, containers, template }) => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white' }}>
      {/* Title name */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>{template?.name || 'Tier List'}</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Created on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Tier rows */}
      {tiersMeta.map(tier => (
        <div key={tier.id} style={{ marginBottom: '15px', borderLeft: `8px solid ${tier.color}`, backgroundColor: `${tier.color}15`, borderRadius: '4px', overflow: 'hidden'}}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: tier.color, padding: '10px 15px', minHeight: '60px'}}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '80px', height: '60px', backgroundColor: tier.color, color: '#000', fontWeight: 'bold', fontSize: '24px', border: '2px solid #000', marginRight: '15px'}}>
              {tier.label}
            </div>
            
            {/* Items in this tier */}
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '10px 0'
            }}>
              {(containers[tier.id] || []).map(item => (
                <div key={item.id} style={{
                  width: '100px',
                  height: '100px',
                  border: '2px solid #000',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: 'white'
                }}>
                  <img
                    src={item.imageUrl}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      padding: '2px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExportTierlist;