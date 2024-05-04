import styles from './StatusIndicator.module.css';

const StatusIndicator = ({ status, size=10, pulse=false, className='' }) => {
    return (  
        <svg 
        className={styles.indicator} 
        width={size} 
        height={size} 
        style={{
            minWidth: size,
            minHeight: size
        }}
        viewBox={`0 0 ${size} ${size}`} 
        fill='none' 
        xmlns='http://www.w3.org/2000/svg'>
            <circle cx={size / 2} cy={size / 2} r={size / 4} data-status={status} />
            {pulse && (
                <circle cx={size / 2} cy={size / 2} r={size / 4} data-status={status} fillOpacity={0.3}>
                    <animate attributeName='r' values={`0;${size / 2};0`} dur='2s' repeatCount='indefinite' />
                </circle>
            )}
        </svg>
    );
}
 
export default StatusIndicator;