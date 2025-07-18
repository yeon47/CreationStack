import styles from './ContentCard.module.css';
import { Link } from 'react-router-dom';
import SubsIcon from '../../styles/img/subs_icon.svg'

export const ContentCard = ({ id, thumbnailUrl, creator, title, likes, isSubscriber }) => {
  return (
    <Link to={`/contents/${id}`} className={styles.card}>
      {/* 썸네일 */}
      <div className={styles.thumbnailWrapper}>
        <img src={thumbnailUrl} alt={title} className={styles.thumbnail} />

        {isSubscriber && (
          <img src={SubsIcon} alt="유료 콘텐츠" className={styles.subsIcon} />
        )}
      </div>

      <div className={styles.contentInfo}>
        <div className={styles.creator}>{creator}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>
          <span className={styles.likes}>❤️ ({likes})</span>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
