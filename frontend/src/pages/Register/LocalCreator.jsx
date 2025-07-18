import React, { useState, useEffect } from 'react';
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
  const [jobs, setJobs] = useState([]);

  // 컴포넌트 마운트 시 직업 목록 로드
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const result = await response.json();

        if (response.ok && result.success) {
          setJobs(result.data);
        } else {
          console.error('직업 목록 로드 실패:', result.message);
        }
      } catch (error) {
        console.error('직업 목록 로드 중 오류:', error);
      }
    };

    fetchJobs();
  }, []);

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

    if (!formData.job) {
      alert('직업을 선택해주세요.');
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
          role: 'CREATOR',
          jobId: parseInt(formData.job),
          bio: null,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { accessToken, refreshToken } = result.data.tokens;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        localStorage.setItem('userInfo', JSON.stringify(result.data.user));

        alert('크리에이터 회원가입이 완료되었습니다!');
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
      const response = await fetch(`/api/users/check-email?email=${encodeURIComponent(formData.email)}`);
      const result = await response.json();

      if (response.ok && result.success) {
        if (result.available) {
          alert('사용 가능한 이메일입니다.');
        } else {
          alert('이미 사용 중인 이메일입니다.');
        }
      } else {
        alert(`오류: ${result.message}`);
      }
    } catch (error) {
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
      console.error('Email check error:', error);
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
                    {jobs.map(job => (
                      <SelectItem key={job.jobId} value={job.jobId.toString()}>
                        {job.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
