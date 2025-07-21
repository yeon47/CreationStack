import styles from './ContentCard.module.css';
import { Link } from 'react-router-dom';
import SubsIcon from '../../assets/img/subs_icon.svg';

export const ContentCard = ({ contentId, thumbnailUrl, creatorNickname, title, likes, isPaid, categoryNames = [] }) => {

  return (
    <Link to={`/contents/${contentId}`} className={styles.card}>
      {/* 썸네일 */}
      <div className={styles.thumbnailWrapper}>
        <img src={thumbnailUrl} alt={title} className={styles.thumbnail} />

        {isPaid && (
          <img src={SubsIcon} alt="유료 콘텐츠" className={styles.subsIcon} />
        )}
      </div>

      <div className={styles.contentInfo}>
        <div className={styles.creator}>{creatorNickname}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>
          <span className={styles.likes}>❤️ ({likes})</span>
          <div className={styles.categories}>
            {categoryNames.map((category, index) => (
              <span key={index} className={styles.category}>{category}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
