import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/Member/Card';
import { Input } from '../../components/Member/Input';
import { SimpleLabel } from '../../components/Member/SimpleLabel';
import styles from './LocalCommon.module.css';

import Eye from '../../components/Member/Eye';
import EyeOff from '../../components/Member/EyeOff';

export const LocalCommon = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 비밀번호 보이기/숨기기 상태
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  // 닉네임 중복 실시간 처리
  const [nicknameStatus, setNicknameStatus] = useState({
    message: '',
    isAvailable: null, // null: 초기, true: 사용 가능, false: 중복
  });

  // 이메일 중복 처리
  const [emailStatus, setEmailStatus] = useState({
    message: '',
    isAvailable: null,
  });

  useEffect(() => {
    const nickname = formData.nickname.trim();
    if (nickname.length < 2) {
      setNicknameStatus({ message: '', isAvailable: null });
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const response = await fetch(`/api/users/check-nickname?nickname=${nickname}`);
        const result = await response.json();
        setNicknameStatus({
          message: result.message,
          isAvailable: result.available,
        });
      } catch (error) {
        console.error('Nickname check failed:', error);
        setNicknameStatus({ message: '확인 중 오류 발생', isAvailable: false });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [formData.nickname]);
  const formFields = [
    {
      id: 'email',
      label: '이메일 주소',
      placeholder: '이메일 주소를 입력해주세요',
      required: true,
      hasButton: true,
      buttonText: '중복 확인',
    },
    {
      id: 'name',
      label: '이름',
      placeholder: '이름을 입력해주세요',
      required: true,
    },
    {
      id: 'nickname',
      label: '닉네임',
      placeholder: '닉네임을 입력해주세요',
      required: true,
    },
    {
      id: 'password',
      label: '비밀번호',
      placeholder: '비밀번호를 입력해주세요',
      required: true,
      type: 'password',
    },
    {
      id: 'confirmPassword',
      label: '비밀번호 확인',
      placeholder: '비밀번호를 입력해주세요',
      required: true,
      type: 'password',
    },
  ];

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));

    if (id === 'email') {
      setEmailStatus({ message: '', isAvailable: null });
    }
  };

  // 비밀번호 보이기/숨기기 토글 핸들러
  const togglePasswordVisibility = fieldId => {
    setPasswordVisibility(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (emailStatus.isAvailable === false) {
      alert('이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.');
      return;
    }

    if (nicknameStatus.isAvailable === false) {
      alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 사용해주세요.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.name,
          nickname: formData.nickname,
          password: formData.password,
          role: 'USER',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('회원가입이 완료되었습니다!');
        window.location.href = '/login';
      } else {
        const error = await response.json();
        alert(`회원가입 실패: ${error.message}`);
      }
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkEmailDuplicate = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`/api/users/check-email?email=${formData.email}`);
      const result = await response.json();
      // alert 대신 상태를 업데이트합니다.
      setEmailStatus({
        message: result.message,
        isAvailable: result.available,
      });
    } catch (error) {
      console.error('Email check error:', error);
      setEmailStatus({ message: '확인 중 오류가 발생했습니다.', isAvailable: false });
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.welcomeText}>
                <span>Welcome to </span>
                <span className={styles.brandName}>창조스택</span>
              </div>
              <div className={styles.title}>회원가입</div>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.loginPrompt}>계정이 있으신가요?</div>
              <button className={styles.loginLink} onClick={handleLoginClick}>
                로그인
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              {formFields.map(field => (
                <div key={field.id} className={styles.fieldContainer}>
                  <div className={styles.labelWrapper}>
                    <SimpleLabel htmlFor={field.id} className={styles.fieldLabel}>
                      {field.label} {field.required && <span className={styles.required}>*</span>}
                    </SimpleLabel>
                    {field.id === 'email' && emailStatus.message && (
                      <span
                        className={`${styles.statusMessage} ${
                          emailStatus.isAvailable ? styles.available : styles.unavailable
                        }`}>
                        {emailStatus.message}
                      </span>
                    )}
                    {field.id === 'nickname' && nicknameStatus.message && (
                      <span
                        className={`${styles.statusMessage} ${
                          nicknameStatus.isAvailable ? styles.available : styles.unavailable
                        }`}>
                        {nicknameStatus.message}
                      </span>
                    )}
                  </div>
                  {field.hasButton ? (
                    <div className={styles.inputWithButton}>
                      <div className={styles.inputWrapper}>
                        <Input
                          id={field.id}
                          placeholder={field.placeholder}
                          className={styles.input}
                          value={formData[field.id]}
                          onChange={handleInputChange}
                          required={field.required}
                        />
                      </div>
                      <button type="button" className={styles.duplicateCheckButton} onClick={checkEmailDuplicate}>
                        {field.buttonText}
                      </button>
                    </div>
                  ) : (
                    <div className={styles.inputWrapperRegular}>
                      <Input
                        id={field.id}
                        // 상태에 따라 type을 동적으로 변경
                        type={
                          field.type === 'password'
                            ? passwordVisibility[field.id]
                              ? 'text'
                              : 'password'
                            : field.type || 'text'
                        }
                        placeholder={field.placeholder}
                        className={styles.input}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        required={field.required}
                      />
                      {/* 비밀번호 필드일 경우 아이콘 버튼 추가 */}
                      {field.type === 'password' && (
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(field.id)}
                          className={styles.passwordIcon}>
                          {passwordVisibility[field.id] ? (
                            <EyeOff size={20} color="#8D8D8D" />
                          ) : (
                            <Eye size={20} color="#8D8D8D" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.submitSection}>
              <div className={styles.buttonContainer}>
                {onBack && (
                  <button type="button" className={styles.backButton} onClick={onBack}>
                    이전
                  </button>
                )}
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? '처리 중...' : '회원가입'}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
