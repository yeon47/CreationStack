import React, { useState, useEffect, useCallback } from 'react';
import styles from './LocalCreator.module.css';

import { Card, CardContent } from '../../components/Member/Card';
import { Input } from '../../components/Member/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/Member/Select';
import { validateField, debounce } from '../../utils/validationUtils';
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

  const [jobs, setJobs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({ password: false, confirmPassword: false });
  const [nicknameStatus, setNicknameStatus] = useState({
    message: '',
    isAvailable: null,
    isChecking: false,
  });
  const [emailStatus, setEmailStatus] = useState({
    message: '',
    isAvailable: null,
    isChecking: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [fieldStates, setFieldStates] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const result = await response.json();
          setJobs(result.data || []);
        } else {
          console.error('직업 목록을 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('직업 목록 요청 중 오류 발생:', error);
      }
    };
    fetchJobs();
  }, []);

  // 닉네임 중복 확인 디바운스 함수
  const debouncedNicknameCheck = useCallback(
    debounce(async nickname => {
      if (nickname.length < 2) {
        setNicknameStatus({ message: '', isAvailable: null, isChecking: false });
        return;
      }

      setNicknameStatus(prev => ({ ...prev, isChecking: true }));

      try {
        const response = await fetch(`/api/users/check-nickname?nickname=${nickname}`);
        const result = await response.json();
        setNicknameStatus({
          message: result.message,
          isAvailable: result.available,
          isChecking: false,
        });
      } catch (error) {
        setNicknameStatus({
          message: '확인 중 오류 발생',
          isAvailable: false,
          isChecking: false,
        });
      }
    }, 500),
    []
  );

  // 닉네임 변경 시 중복 확인
  useEffect(() => {
    const nickname = formData.nickname.trim();
    if (nickname && !validationErrors.nickname) {
      debouncedNicknameCheck(nickname);
    } else {
      setNicknameStatus({ message: '', isAvailable: null, isChecking: false });
    }
  }, [formData.nickname, validationErrors.nickname, debouncedNicknameCheck]);

  const handleInputChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    // 필드 터치 상태 업데이트
    setFieldStates(prev => ({
      ...prev,
      [id]: { ...prev[id], touched: true },
    }));

    // 실시간 유효성 검사
    if (id !== 'confirmPassword') {
      const validation = validateField(id, value);
      setValidationErrors(prev => ({
        ...prev,
        [id]: validation.isValid ? '' : validation.message,
      }));
    } else {
      // 비밀번호 확인 검증
      if (formData.password && value && formData.password !== value) {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다',
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: '',
        }));
      }
    }

    if (id === 'email') {
      setEmailStatus({ message: '', isAvailable: null, isChecking: false });
    }
  };

  const handleJobChange = value => {
    setFormData(prev => ({ ...prev, jobId: value }));
    // 직업 선택 시 에러 메시지 제거
    setValidationErrors(prev => ({ ...prev, jobId: '' }));
    setFieldStates(prev => ({
      ...prev,
      jobId: { touched: true },
    }));
  };

  const handleInputFocus = fieldId => {
    setFieldStates(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], focused: true },
    }));
  };

  const handleInputBlur = fieldId => {
    setFieldStates(prev => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], focused: false, touched: true },
    }));
  };

  const togglePasswordVisibility = fieldId => {
    setPasswordVisibility(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const checkEmailDuplicate = async () => {
    // 이메일 유효성 검사 먼저 실행
    const emailValidation = validateField('email', formData.email);
    if (!emailValidation.isValid) {
      setValidationErrors(prev => ({
        ...prev,
        email: emailValidation.message,
      }));
      setFieldStates(prev => ({
        ...prev,
        email: { touched: true },
      }));
      return;
    }

    setEmailStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const response = await fetch(`/api/users/check-email?email=${formData.email}`);
      const result = await response.json();
      setEmailStatus({
        message: result.message,
        isAvailable: result.available,
        isChecking: false,
      });
    } catch (error) {
      setEmailStatus({
        message: '확인 중 오류가 발생했습니다.',
        isAvailable: false,
        isChecking: false,
      });
    }
  };

  const handleLoginClick = () => {
    window.location.href = '/login';
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // 모든 필드를 터치된 상태로 설정
    const allFieldStates = {};
    ['email', 'name', 'nickname', 'password', 'confirmPassword', 'jobId'].forEach(field => {
      allFieldStates[field] = { touched: true, focused: false };
    });
    setFieldStates(allFieldStates);

    // 전체 폼 유효성 검사
    const errors = {};

    // 각 필드 유효성 검사
    const emailValidation = validateField('email', formData.email);
    const nameValidation = validateField('name', formData.name);
    const nicknameValidation = validateField('nickname', formData.nickname);
    const passwordValidation = validateField('password', formData.password);

    if (!emailValidation.isValid) errors.email = emailValidation.message;
    if (!nameValidation.isValid) errors.name = nameValidation.message;
    if (!nicknameValidation.isValid) errors.nickname = nicknameValidation.message;
    if (!passwordValidation.isValid) errors.password = passwordValidation.message;
    if (!formData.jobId) errors.jobId = '직업을 선택해주세요';

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (emailStatus.isAvailable === false) {
      alert('이미 사용 중인 이메일입니다.');
      return;
    }
    if (nicknameStatus.isAvailable === false) {
      alert('이미 사용 중인 닉네임입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          username: formData.name.trim(),
          nickname: formData.nickname.trim(),
          password: formData.password,
          role: 'CREATOR',
          jobId: parseInt(formData.jobId),
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

  // 필드별 에러 메시지 표시 여부 결정
  const shouldShowError = fieldId => {
    return fieldStates[fieldId]?.touched && validationErrors[fieldId];
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

                  {/* 유효성 검사 에러 메시지 */}
                  {shouldShowError('email') && (
                    <span className={`${styles.statusMessage} ${styles.unavailable}`}>{validationErrors.email}</span>
                  )}

                  {/* 이메일 중복 확인 메시지 */}
                  {emailStatus.message && !shouldShowError('email') && (
                    <span
                      className={`${styles.statusMessage} ${
                        emailStatus.isAvailable ? styles.available : styles.unavailable
                      }`}>
                      {emailStatus.isChecking ? '확인 중...' : emailStatus.message}
                    </span>
                  )}
                </div>
                <div className={styles.emailContainer}>
                  <Input
                    id="email"
                    className={`${styles.emailInput} ${shouldShowError('email') ? styles.inputError : ''}`}
                    placeholder="이메일 주소를 입력해주세요 (예: user@example.com)"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('email')}
                    onBlur={() => handleInputBlur('email')}
                    required
                  />
                  <button
                    type="button"
                    className={styles.duplicateCheckButton}
                    onClick={checkEmailDuplicate}
                    disabled={!formData.email || validationErrors.email || emailStatus.isChecking}>
                    {emailStatus.isChecking ? '확인 중...' : '중복 확인'}
                  </button>
                </div>
              </div>

              {/* 이름 */}
              <div className={styles.fieldContainer}>
                <div className={styles.labelWrapper}>
                  <div className={styles.fieldLabel}>
                    <span>이름 </span>
                    <span className={styles.required}>*</span>
                  </div>

                  {/* 유효성 검사 에러 메시지 */}
                  {shouldShowError('name') && (
                    <span className={`${styles.statusMessage} ${styles.unavailable}`}>{validationErrors.name}</span>
                  )}
                </div>
                <Input
                  id="name"
                  className={`${styles.regularInput} ${shouldShowError('name') ? styles.inputError : ''}`}
                  placeholder="이름을 입력해주세요 (한글 또는 영문 2-20자)"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('name')}
                  onBlur={() => handleInputBlur('name')}
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

                  {/* 유효성 검사 에러 메시지 */}
                  {shouldShowError('nickname') && (
                    <span className={`${styles.statusMessage} ${styles.unavailable}`}>{validationErrors.nickname}</span>
                  )}

                  {/* 닉네임 중복 확인 메시지 */}
                  {nicknameStatus.message && !shouldShowError('nickname') && (
                    <span
                      className={`${styles.statusMessage} ${
                        nicknameStatus.isAvailable ? styles.available : styles.unavailable
                      }`}>
                      {nicknameStatus.isChecking ? '확인 중...' : nicknameStatus.message}
                    </span>
                  )}
                </div>
                <Input
                  id="nickname"
                  className={`${styles.regularInput} ${shouldShowError('nickname') ? styles.inputError : ''}`}
                  placeholder="닉네임을 입력해주세요 (2-10자)"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus('nickname')}
                  onBlur={() => handleInputBlur('nickname')}
                  required
                />
              </div>

              {/* 직업 */}
              <div className={styles.fieldContainer}>
                <div className={styles.labelWrapper}>
                  <div className={styles.fieldLabel}>
                    <span>직업 </span>
                    <span className={styles.required}>*</span>
                  </div>

                  {/* 직업 선택 에러 메시지 */}
                  {shouldShowError('jobId') && (
                    <span className={`${styles.statusMessage} ${styles.unavailable}`}>{validationErrors.jobId}</span>
                  )}
                </div>
                <Select value={formData.jobId} onValueChange={handleJobChange}>
                  <SelectTrigger
                    className={`${styles.selectTrigger} ${shouldShowError('jobId') ? styles.inputError : ''}`}>
                    <SelectValue placeholder="직업을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent side="top" sideOffset={4}>
                    {jobs.map(job => (
                      <SelectItem key={job.jobId} value={String(job.jobId)}>
                        {job.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 비밀번호 */}
              <div className={styles.fieldContainer}>
                <div className={styles.labelWrapper}>
                  <div className={styles.fieldLabel}>
                    <span>비밀번호 </span>
                    <span className={styles.required}>*</span>
                  </div>

                  {/* 비밀번호 유효성 검사 에러 메시지 */}
                  {shouldShowError('password') && (
                    <span className={`${styles.statusMessage} ${styles.unavailable}`}>{validationErrors.password}</span>
                  )}
                </div>
                <div className={styles.passwordWrapper}>
                  <Input
                    id="password"
                    type={passwordVisibility.password ? 'text' : 'password'}
                    className={`${styles.regularInput} ${shouldShowError('password') ? styles.inputError : ''}`}
                    placeholder="대소문자, 숫자, 특수문자 포함 8-20자"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={() => handleInputBlur('password')}
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
                <div className={styles.labelWrapper}>
                  <div className={styles.fieldLabel}>
                    <span>비밀번호 확인 </span>
                    <span className={styles.required}>*</span>
                  </div>

                  {/* 비밀번호 확인 에러 메시지 */}
                  {shouldShowError('confirmPassword') && (
                    <span className={`${styles.statusMessage} ${styles.unavailable}`}>
                      {validationErrors.confirmPassword}
                    </span>
                  )}
                </div>
                <div className={styles.passwordWrapper}>
                  <Input
                    id="confirmPassword"
                    type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                    className={`${styles.regularInput} ${shouldShowError('confirmPassword') ? styles.inputError : ''}`}
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus('confirmPassword')}
                    onBlur={() => handleInputBlur('confirmPassword')}
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
