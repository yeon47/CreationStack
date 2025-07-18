import React, { useState } from 'react';
import { Button } from '../../components/Member/Button';
import { Label } from '../../components/Member/Label';
import { RadioGroup, RadioGroupItem } from '../../components/Member/RadioGroup';
import { LocalCommon } from './LocalCommon';
import { LocalCreator } from './LocalCreator';
import styles from './MemberRegister.module.css';

export const MemberRegister = () => {
  const [selectedUserType, setSelectedUserType] = useState('regular');
  const [currentStep, setCurrentStep] = useState('selection'); // "selection", "form"

  const userTypes = [
    {
      id: 'regular',
      title: '일반 사용자',
      description: '컨텐츠를 구독하고 학습하고 싶어요',
    },
    {
      id: 'creator',
      title: '크리에이터',
      description: '컨텐츠를 제작하고 공유하고 싶어요',
    },
  ];

  const handleNext = () => {
    console.log('Selected user type:', selectedUserType);
    setCurrentStep('form');
  };

  const handleBack = () => {
    setCurrentStep('selection');
  };

  // 사용자 타입 선택 단계가 아니면 해당 폼 컴포넌트를 렌더링
  if (currentStep === 'form') {
    if (selectedUserType === 'regular') {
      return <LocalCommon onBack={handleBack} />;
    } else if (selectedUserType === 'creator') {
      return <LocalCreator onBack={handleBack} />;
    }
  }

  // 사용자 타입 선택 화면
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoInner}>
            <img
              className={styles.logoImage}
              alt="Mask group"
              src="https://c.animaapp.com/md58ogpbjLJ0MJ/img/mask-group-2.svg"
            />
          </div>
        </div>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>회원가입</h1>
          </div>
          <div className={styles.subtitleSection}>
            <p className={styles.subtitle}>CreationStack에 오신 것을 환영합니다!</p>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        <RadioGroup value={selectedUserType} onValueChange={setSelectedUserType} className={styles.radioGroup}>
          {userTypes.map(type => (
            <div key={type.id} className={styles.radioOption} data-selected={selectedUserType === type.id}>
              <RadioGroupItem
                value={type.id}
                id={type.id}
                className={styles.radioButton}
                data-state={selectedUserType === type.id ? 'checked' : 'unchecked'}
              />

              <Label htmlFor={type.id} className={styles.radioLabel} onClick={() => setSelectedUserType(type.id)}>
                <div className={styles.radioContent}>
                  <div className={styles.optionTitle}>{type.title}</div>
                  <div className={styles.optionDescription}>{type.description}</div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className={styles.buttonContainer}>
          <button className={styles.backButton} onClick={() => (window.location.href = '/login')}>
            이전
          </button>
          <button className={styles.nextButton} onClick={handleNext}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
};
