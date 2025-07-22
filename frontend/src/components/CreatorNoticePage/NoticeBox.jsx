import React, { useEffect, useState } from 'react';
import styles from './NoticeBox.module.css';
import Picker from '@emoji-mart/react';
import { toggleReaction, getReactions } from '@/api/notice.js';

const NoticeBox = ({ date, profileImage, content, time, noticeId, token, initialReactions, userReactedEmoji }) => {
  const [reactions, setReactions] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [setUserEmoji] = useState(userReactedEmoji || null);

  useEffect(() => {
    setReactions(initialReactions || []);
    setUserEmoji(userReactedEmoji || null);
  }, [initialReactions, userReactedEmoji]);

  const handleEmojiClick = async emoji => {
    try {
      await toggleReaction(noticeId, emoji, token);

      // 사용자 반응 상태에 따라 토글 처리
      setUserEmoji(prev => (prev === emoji ? null : emoji));

      // 최신 리액션 목록 받아와서 갱신
      const updated = await getReactions(noticeId, token);
      return Response.data;
    } catch (error) {
      console.error('이모지 토글 실패:', error);
    }
  };

  const handlePickerSelect = emoji => {
    handleEmojiClick(emoji.native); // 유니코드 이모지
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
              {Array.isArray(reactions) &&
                reactions.map((reaction, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(reaction.emoji)}
                    className={`${styles.emojiButton} ${reaction.reacted ? styles.active : ''}`}>
                    {reaction.emoji} {reaction.count}
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
