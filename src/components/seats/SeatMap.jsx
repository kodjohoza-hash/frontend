import React, { useMemo } from 'react';
import BusSeat from './BusSeat';

const SeatMap = React.memo(function SeatMap({ layout, seats, selectedSeats, onSeatToggle }) {
  const rows = useMemo(() => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) grouped[seat.row] = { left: [], right: [] };
      grouped[seat.row][seat.side].push(seat);
    });
    Object.keys(grouped).forEach((row) => {
      grouped[row].left.sort((a, b) => a.number - b.number);
      grouped[row].right.sort((a, b) => a.number - b.number);
    });
    return grouped;
  }, [seats]);

  const rowNumbers = useMemo(() => Object.keys(rows).map(Number).sort((a, b) => a - b), [rows]);
  const busConfig = layout;

  const styles = {
    busContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
    },
    busBody: {
      position: 'relative',
      width: '100%',
      maxWidth: '340px',
      backgroundColor: '#F8FAFC',
      borderRadius: '24px',
      border: '3px solid #0B1D51',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(11, 29, 81, 0.15), 0 2px 8px rgba(0,0,0,0.06)',
    },
    windshield: {
      position: 'relative',
      height: '48px',
      background: 'linear-gradient(135deg, #0B1D51 0%, #1A3A7A 50%, #0B1D51 100%)',
      borderRadius: '21px 21px 0 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    windshieldGlass: {
      position: 'absolute',
      top: '6px',
      left: '20%',
      right: '20%',
      bottom: '4px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
      borderRadius: '12px 12px 0 0',
      border: '1px solid rgba(255,255,255,0.08)',
    },
    windshieldText: {
      position: 'relative',
      zIndex: 1,
      color: 'rgba(255,255,255,0.85)',
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    driverArea: {
      position: 'relative',
      margin: '0 12px',
      padding: '8px 12px',
      backgroundColor: '#EFF3F8',
      borderRadius: '0 0 8px 8px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderBottom: '2px dashed #CBD5E1',
    },
    steeringWheel: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      border: '3px solid #64748B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      color: '#64748B',
      flexShrink: 0,
    },
    driverLabel: {
      fontSize: '9px',
      fontWeight: 700,
      color: '#64748B',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
    doorArea: {
      position: 'absolute',
      top: '105px',
      left: '-3px',
      width: '22px',
      height: '40px',
      backgroundColor: '#F8FAFC',
      borderRight: '3px solid #0B1D51',
      borderBottom: '2px solid #CBD5E1',
      borderRadius: '0 0 6px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    doorIcon: {
      fontSize: '14px',
      color: '#64748B',
    },
    seatsArea: {
      padding: '8px 14px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: `${busConfig?.rowGap || 7}px`,
    },
    seatRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '0',
    },
    rowNumber: {
      width: '18px',
      fontSize: '9px',
      fontWeight: 700,
      color: '#94A3B8',
      textAlign: 'center',
      flexShrink: 0,
    },
    seatGroup: {
      display: 'flex',
      gap: '4px',
    },
    aisle: {
      width: '26px',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    aisleLine: {
      width: '2px',
      height: '100%',
      minHeight: '20px',
      background: 'repeating-linear-gradient(to bottom, #CBD5E1 0px, #CBD5E1 3px, transparent 3px, transparent 7px)',
      borderRadius: '1px',
    },
    windowLeft: {
      position: 'absolute',
      left: '3px',
      top: '140px',
      bottom: '60px',
      width: '4px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '4px 0',
    },
    windowRight: {
      position: 'absolute',
      right: '3px',
      top: '140px',
      bottom: '60px',
      width: '4px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      padding: '4px 0',
    },
    windowPane: {
      flex: 1,
      minWidth: '4px',
      backgroundColor: '#BFDBFE',
      borderRadius: '2px',
      opacity: 0.5,
    },
    toiletArea: {
      margin: '0 14px 10px',
      padding: '6px 10px',
      backgroundColor: '#F0F4F8',
      borderRadius: '6px',
      border: '1px dashed #CBD5E1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    toiletIcon: {
      fontSize: '14px',
    },
    toiletLabel: {
      fontSize: '8px',
      fontWeight: 700,
      color: '#94A3B8',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    backWall: {
      height: '6px',
      margin: '0 14px 12px',
      background: 'linear-gradient(135deg, #0B1D51 0%, #1A3A7A 100%)',
      borderRadius: '3px',
    },
    sideWindows: {
      position: 'absolute',
      top: '135px',
      left: '0',
      right: '0',
      bottom: '50px',
      pointerEvents: 'none',
      zIndex: 0,
    },
    sideWindowLeft: {
      position: 'absolute',
      left: '1px',
      top: 0,
      bottom: 0,
      width: '5px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    sideWindowRight: {
      position: 'absolute',
      right: '1px',
      top: 0,
      bottom: 0,
      width: '5px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    winPane: {
      flex: 1,
      minWidth: '4px',
      background: 'linear-gradient(180deg, #93C5FD 0%, #BFDBFE 100%)',
      borderRadius: '1px',
      opacity: 0.45,
    },
    backWheel: {
      position: 'absolute',
      bottom: '-8px',
      width: '24px',
      height: '12px',
      backgroundColor: '#1E293B',
      borderRadius: '4px',
      zIndex: 2,
    },
  };

  return (
    <div style={styles.busContainer} role="img" aria-label="Plan du bus - Sélectionnez vos sièges">
      <div style={styles.busBody}>
        {/* Windshield */}
        <div style={styles.windshield}>
          <div style={styles.windshieldGlass} />
          <span style={styles.windshieldText}>
            <i className="bi bi-bus-front" style={{ marginRight: '6px' }} />
            PARE-BRISE
          </span>
        </div>

        {/* Driver Area */}
        <div style={styles.driverArea}>
          <div style={styles.steeringWheel}>
            <i className="bi bi-circle" style={{ fontSize: '8px' }} />
          </div>
          <span style={styles.driverLabel}>CONDUCTEUR</span>
        </div>

        {/* Door indicator */}
        <div style={styles.doorArea} aria-label="Porte d'entrée">
          <i className="bi bi-door-open" style={styles.doorIcon} />
        </div>

        {/* Side windows */}
        <div style={styles.sideWindows}>
          <div style={styles.sideWindowLeft}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`wl-${i}`} style={styles.winPane} />
            ))}
          </div>
          <div style={styles.sideWindowRight}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`wr-${i}`} style={styles.winPane} />
            ))}
          </div>
        </div>

        {/* Seats */}
        <div style={styles.seatsArea}>
          {rowNumbers.map((rowNum) => (
            <div key={rowNum} style={styles.seatRow}>
              <span style={styles.rowNumber}>
                {String(rowNum).padStart(2, '0')}
              </span>

              <div style={styles.seatGroup}>
                {rows[rowNum].left.map((seat) => (
                  <BusSeat
                    key={seat.id}
                    seat={{ ...seat, width: busConfig?.seatWidth || 38, height: busConfig?.seatHeight || 34 }}
                    isSelected={selectedSeats.includes(seat.number)}
                    onToggle={onSeatToggle}
                    disabled={seat.state === 'occupied' || seat.state === 'reserved'}
                  />
                ))}
              </div>

              <div style={styles.aisle} aria-hidden="true">
                <div style={styles.aisleLine} />
              </div>

              <div style={styles.seatGroup}>
                {rows[rowNum].right.map((seat) => (
                  <BusSeat
                    key={seat.id}
                    seat={{ ...seat, width: busConfig?.seatWidth || 38, height: busConfig?.seatHeight || 34 }}
                    isSelected={selectedSeats.includes(seat.number)}
                    onToggle={onSeatToggle}
                    disabled={seat.state === 'occupied' || seat.state === 'reserved'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Toilet */}
        {busConfig?.hasToilet && (
          <div style={styles.toiletArea} aria-label="Toilettes">
            <span style={styles.toiletIcon}>🚻</span>
            <span style={styles.toiletLabel}>TOILETTE</span>
          </div>
        )}

        {/* Back wall */}
        <div style={styles.backWall} />

        {/* Back wheels */}
        <div style={{ ...styles.backWheel, left: '28px' }} />
        <div style={{ ...styles.backWheel, right: '28px' }} />
      </div>
    </div>
  );
});

export default SeatMap;
