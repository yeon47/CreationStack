import React, { useState } from 'react';
import { Button } from '../../components/Member/Button';
import { Card, CardContent } from '../../components/Member/Card';
import { Input } from '../../components/Member/Input';
import { SimpleLabel } from '../../components/Member/SimpleLabel';
import styles from './LocalCommon.module.css';

export const LocalCommon = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form field data with labels and placeholders
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
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // 비밀번호 확인 검증
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
          username: formData.name,
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
          role: 'USER', // 일반 사용자
          jobId: null, // 일반 사용자는 직업 선택 안함
          bio: null,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 회원가입 성공 처리
        const { accessToken, refreshToken } = result.data.tokens;

        // 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // 사용자 정보 저장
        localStorage.setItem('userInfo', JSON.stringify(result.data.user));

        alert('회원가입이 완료되었습니다!');
        window.location.href = '/login';
      } else {
        alert(`회원가입 실패: ${result.message}`);
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
      console.log('이메일 중복 확인 요청:', formData.email);
      const response = await fetch(`/api/users/check-email?email=${encodeURIComponent(formData.email)}`);
      console.log('응답 상태:', response.status);

      const result = await response.json();
      console.log('응답 데이터:', result);

      if (response.ok && result.success) {
        if (result.available) {
          alert('사용 가능한 이메일입니다.');
        } else {
          alert('이미 사용 중인 이메일입니다.');
        }
      } else {
        alert(`오류: ${result.message || '알 수 없는 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error('이메일 중복 확인 중 오류:', error);
      alert(`이메일 중복 확인 중 오류가 발생했습니다. 상세: ${error.message}`);
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          {/* Header Section */}
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

          {/* Form Fields */}
          <form onSubmit={handleSubmit}>
            <div className={styles.formFields}>
              {formFields.map(field => (
                <div key={field.id} className={styles.fieldContainer}>
                  <SimpleLabel htmlFor={field.id} className={styles.fieldLabel}>
                    {field.label} {field.required && <span className={styles.required}>*</span>}
                  </SimpleLabel>

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
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                        className={styles.input}
                        value={formData[field.id]}
                        onChange={handleInputChange}
                        required={field.required}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit Button */}
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
