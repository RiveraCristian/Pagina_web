import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'avatar' | 'card' | 'list';
  count?: number;
}

export function SkeletonLoader({ type = 'text', count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <div className="skeleton skeleton-text"></div>
        );
      
      case 'title':
        return (
          <div className="skeleton skeleton-title"></div>
        );
      
      case 'avatar':
        return (
          <div className="skeleton skeleton-avatar"></div>
        );
      
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton skeleton-card-header"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
          </div>
        );
      
      case 'list':
        return (
          <div className="skeleton-list-item">
            <div className="skeleton skeleton-avatar"></div>
            <div className="skeleton-list-content">
              <div className="skeleton skeleton-title" style={{ width: '60%' }}></div>
              <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
            </div>
          </div>
        );
      
      default:
        return <div className="skeleton skeleton-text"></div>;
    }
  };

  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
}
