import React, { useState } from 'react';
import styles from './NoticeBox.module.css';
import Picker from '@emoji-mart/react';

const NoticeBox = ({ date, profileImage, content, time }) => {
  const [reactions, setReactions] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const handleEmojiClick = emoji => {
    setReactions(prev => {
      const existing = prev.find(r => r.emoji === emoji);
      if (existing) {
        // 이미 눌렀으면 제거
        return prev.filter(r => r.emoji !== emoji);
      } else {
        // 새로 추가
        return [...prev, { emoji, count: 1 }];
      }
    });
  };

  const handlePickerSelect = emoji => {
    handleEmojiClick(emoji.native); // 유니코드 이모지 반환됨
    setShowPicker(false);
  };

  return (
    <div className={styles.notice}>
      <div className={styles.date}>
        <p>{date}</p>
      </div>
      <div className={styles.post_container}>
        <div className={styles.creator_img}>
          <img src={profileImage} alt="작성자 이미지" />
        </div>
        <div className={styles.post_card}>
          <div className={styles.post_content_container}>
            <div className={styles.post_box}>
              <p className={styles.text}>{content}</p>
            </div>
            <div className={styles.button_container}>
              <button className={styles.edit_button}>수정</button>
              <button className={styles.delete_button}>삭제</button>
            </div>
          </div>
          <div className={styles.post_footer}>
            <div className={styles.time}>{time}</div>
            <div className={styles.reaction}>
              {reactions.map(r => (
                <button key={r.emoji} className={styles.reaction_button} onClick={() => handleEmojiClick(r.emoji)}>
                  {r.emoji} {r.count}
                </button>
              ))}
              <button className={styles.reaction_add_button} onClick={() => setShowPicker(prev => !prev)}>
                ➕
              </button>
              {showPicker && (
                <div className={styles.picker_container}>
                  <Picker onEmojiSelect={handlePickerSelect} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBox;
