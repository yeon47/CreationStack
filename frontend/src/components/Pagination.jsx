import React from 'react';
import styles from '../styles/pagination.module.css';

export const Pagination = () => {
  return (
    <div className={styles['pagination']}>
      <div className={styles['prev']}>
        <div className={styles['text-wrapper-2']}>Prev</div>

        <div className={styles['chevron-left']}>
          <img className={styles['vector']} alt="Vector" src="https://c.animaapp.com/md5g8ubjTWUbxD/img/vector-1.svg" />
        </div>
      </div>

      <div className={styles['nums']}>
        <div className={styles['element']}>
          <div className={styles['num']}>1</div>
        </div>

        <div className={styles['num-wrapper']}>
          <div className={styles['num-2']}>2</div>
        </div>

        <div className={styles['num-wrapper']}>
          <div className={styles['num-3']}>...</div>
        </div>

        <div className={styles['num-wrapper']}>
          <div className={styles['num-2']}>9</div>
        </div>

        <div className={styles['num-wrapper']}>
          <div className={styles['num-4']}>10</div>
        </div>
      </div>

      <div className={styles['next']}>
        <div className={styles['prev-2']}>Next</div>

        <div className={styles['vector-wrapper']}>
          <img className={styles['vector']} alt="Vector" src="https://c.animaapp.com/md5g8ubjTWUbxD/img/vector.svg" />
        </div>
      </div>
    </div>
  );
};
