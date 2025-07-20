import React, { useState, useEffect } from 'react';
import styles from './LocalCreator.module.css';

import { Card, CardContent } from '../../components/Member/Card';
import { Input } from '../../components/Member/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/Member/Select';
import { SimpleLabel } from '../../components/Member/SimpleLabel';
import Eye from '../../components/Member/Eye';
import EyeOff from '../../components/Member/EyeOff';

export const LocalCreator = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    nickname: '',
    jobId: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({ password: false, confirmPassword: false });
  const [nicknameStatus, setNicknameStatus] = useState({ message: '', isAvailable: null });
  const [emailStatus, setEmailStatus] = useState({ message: '', isAvailable: null });

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
        setNicknameStatus({ message: result.message, isAvailable: result.available });
      } catch (error) {
        setNicknameStatus({ message: '확인 중 오류 발생', isAvailable: false });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.nickname]);

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'email') {
      setEmailStatus({ message: '', isAvailable: null });
    }
  };

  const handleJobChange = value => {
    setFormData(prev => ({ ...prev, jobId: value }));
  };

  const togglePasswordVisibility = fieldId => {
    setPasswordVisibility(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const checkEmailDuplicate = async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`/api/users/check-email?email=${formData.email}`);
      const result = await response.json();
      setEmailStatus({ message: result.message, isAvailable: result.available });
    } catch (error) {
      setEmailStatus({ message: '확인 중 오류가 발생했습니다.', isAvailable: false });
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (emailStatus.isAvailable === false) {
      alert('이미 사용 중인 이메일입니다.');
      return;
    }
    if (nicknameStatus.isAvailable === false) {
      alert('이미 사용 중인 닉네임입니다.');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.name,
          nickname: formData.nickname,
          password: formData.password,
          role: 'CREATOR',
          jobId: formData.jobId,
        }),
      });
      const result = await response.json();
      alert(result.message);
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      alert('회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
              {/* 이메일 */}
              <div className={styles.fieldContainer}>
                <div className={styles.labelWrapper}>
                  <div className={styles.fieldLabel}>
                    <span>이메일 주소 </span>
                    <span className={styles.required}>*</span>
                  </div>
                  {emailStatus.message && (
                    <span
                      className={`${styles.statusMessage} ${
                        emailStatus.isAvailable ? styles.available : styles.unavailable
                      }`}>
                      {emailStatus.message}
                    </span>
                  )}
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

              {/* 이름 */}
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

              {/* 닉네임 */}
              <div className={styles.fieldContainer}>
                <div className={styles.labelWrapper}>
                  <div className={styles.fieldLabel}>
                    <span>닉네임 </span>
                    <span className={styles.required}>*</span>
                  </div>
                  {nicknameStatus.message && (
                    <span
                      className={`${styles.statusMessage} ${
                        nicknameStatus.isAvailable ? styles.available : styles.unavailable
                      }`}>
                      {nicknameStatus.message}
                    </span>
                  )}
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

              {/* 직업 */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>직업 </span>
                  <span className={styles.required}>*</span>
                </div>
                <Select value={formData.jobId} onValueChange={handleJobChange}>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="직업을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">개발자</SelectItem>
                    <SelectItem value="2">디자이너</SelectItem>
                    <SelectItem value="3">기획자</SelectItem>
                    <SelectItem value="4">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 비밀번호 */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>비밀번호 </span>
                  <span className={styles.required}>*</span>
                </div>
                <div className={styles.passwordWrapper}>
                  <Input
                    id="password"
                    type={passwordVisibility.password ? 'text' : 'password'}
                    className={styles.regularInput}
                    placeholder="비밀번호를 입력해주세요"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className={styles.passwordIcon}>
                    {passwordVisibility.password ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className={styles.fieldContainer}>
                <div className={styles.fieldLabel}>
                  <span>비밀번호 확인 </span>
                  <span className={styles.required}>*</span>
                </div>
                <div className={styles.passwordWrapper}>
                  <Input
                    id="confirmPassword"
                    type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                    className={styles.regularInput}
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className={styles.passwordIcon}>
                    {passwordVisibility.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.submitContainer}>
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
