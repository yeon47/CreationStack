import React, { useState } from 'react';
import { Card, CardContent } from '../../components/Member/Card';
import { Input } from '../../components/Member/Input';
import { Button } from '../../components/Member/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/Member/Select';
import styles from './LocalCreator.module.css';

export const LocalCreator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    nickname: '',
    job: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleJobChange = value => {
    setFormData(prev => ({
      ...prev,
      job: value,
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
      const response = await fetch('/api/users/creator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          nickname: formData.nickname,
          job: formData.job,
          password: formData.password,
          userType: 'creator',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('크리에이터 회원가입이 완료되었습니다!');
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

      if (result.available) {
        alert('사용 가능한 이메일입니다.');
      } else {
        alert('이미 사용 중인 이메일입니다.');
      }
    } catch (error) {
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
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
            <div className={styles.formContainer}>
              {/* Email field with duplicate check button */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>이메일 주소 </span>
                  <span className={styles.required}>*</span>
                </div>
                <div className={styles.emailContainer}>
                  <Input
                    id="email"
                    className={styles.emailInput}
                    placeholder="이메일 주소를 입력해주세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <button type="button" className={styles.duplicateCheckButton} onClick={checkEmailDuplicate}>
                    중복 확인
                  </button>
                </div>
              </div>

              {/* Name field */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>이름 </span>
                  <span className={styles.required}>*</span>
                </div>
                <Input
                  id="name"
                  className={styles.regularInput}
                  placeholder="이름을 입력해주세요"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Nickname field */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>닉네임 </span>
                  <span className={styles.required}>*</span>
                </div>
                <Input
                  id="nickname"
                  className={styles.regularInput}
                  placeholder="닉네임을 입력해주세요"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Job/Occupation dropdown */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>직업 </span>
                  <span className={styles.required}>*</span>
                </div>
                <Select value={formData.job} onValueChange={handleJobChange}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="직업을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">개발자</SelectItem>
                    <SelectItem value="designer">디자이너</SelectItem>
                    <SelectItem value="manager">매니저</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password field */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>비밀번호 </span>
                  <span className={styles.required}>*</span>
                </div>
                <Input
                  id="password"
                  type="password"
                  className={styles.regularInput}
                  placeholder="비밀번호를 입력해주세요"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password confirmation field */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>비밀번호 확인 </span>
                  <span className={styles.required}>*</span>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  className={styles.regularInput}
                  placeholder="비밀번호를 입력해주세요"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Sign up button */}
            <div className={styles.submitContainer}>
              <div className={styles.submitButtonWrapper}>
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
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
