import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Label } from '../../components/Label';
import { RadioGroup, RadioGroupItem } from '../../components/RadioGroup';
import { LocalCommon } from './LocalCommon';
import { LocalCreator } from './LocalCreator';
import './MemberRegister.css';

export const MemberRegister = () => {
  const [step, setStep] = useState(1); // 1: 타입 선택, 2: 회원가입 폼
  const [selectedType, setSelectedType] = useState('regular');

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
    console.log('선택된 유형:', selectedType);

    if (selectedType === 'regular') {
      // 일반 사용자 선택 시 LocalCommon 화면으로 이동
      setStep(2);
    } else if (selectedType === 'creator') {
      // 크리에이터 선택 시 LocalCreator 화면으로 이동
      setStep(3);
    }
  };

  const handleRadioChange = value => {
    setSelectedType(value);
  };

  // 1단계: 타입 선택 화면
  if (step === 1) {
    return (
      <div className="flex flex-col min-h-screen items-center gap-[50px] bg-white" data-model-id="212:1488">
        <header className="flex flex-col items-center justify-end px-[140px] py-0 w-full mt-16">
          <div className="relative w-[107px] h-[107px] bg-[url(https://c.animaapp.com/md58ogpbjLJ0MJ/img/mask-group.png)] bg-[100%_100%]">
            <div className="relative h-[107px] bg-[url(https://c.animaapp.com/md58ogpbjLJ0MJ/img/mask-group-1.svg)] bg-[100%_100%]">
              <img
                className="absolute w-[107px] h-[107px] top-0 left-0"
                alt="Mask group"
                src="https://c.animaapp.com/md58ogpbjLJ0MJ/img/mask-group-2.svg"
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-2.5 w-full">
            <div className="flex flex-col items-center w-full">
              <h1 className="mt-[-1.00px] font-['Poppins',Helvetica] font-semibold text-[#101828] text-4xl text-center tracking-[-0.72px] leading-[44px]">
                회원가입
              </h1>
            </div>

            <div className="flex flex-col items-center px-0 py-2.5 w-full">
              <p className="mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-[#667085] text-xl text-center tracking-[0] leading-[30px] whitespace-nowrap">
                CreationStack에 오신 것을 환영합니다!
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center gap-[60px] py-5">
          <RadioGroup value={selectedType} onValueChange={handleRadioChange} className="flex flex-col gap-5 w-[430px]">
            {userTypes.map(type => (
              <div key={type.id} className="relative">
                <RadioGroupItem
                  value={type.id}
                  id={type.id}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 border-2 border-[#dde1eb]"
                />
                <Label
                  htmlFor={type.id}
                  className={`flex w-full h-[86px] items-start bg-white rounded-lg overflow-hidden border cursor-pointer transition-colors ${
                    selectedType === type.id ? 'border-[#91c8e4] bg-blue-50' : 'border-[#dde1eb] hover:border-[#91c8e4]'
                  }`}>
                  <div className="flex flex-col items-start gap-2.5 p-2.5">
                    <div className="font-['Poppins',Helvetica] font-semibold text-[#101828] text-2xl tracking-[0] leading-8 whitespace-nowrap">
                      {type.title}
                    </div>
                    <div className="font-['Poppins',Helvetica] font-normal text-[#667085] text-base tracking-[0] leading-6 whitespace-nowrap">
                      {type.description}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-[230px] h-14 border-[#91c8e4] text-[#91c8e4] rounded-lg hover:bg-[#91c8e4] hover:text-white">
              이전
            </Button>
            <Button
              onClick={handleNext}
              className="w-[230px] h-14 bg-[#91c8e4] rounded-lg text-white hover:bg-[#7ab8d8]">
              다음
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2단계: 일반 사용자 회원가입 폼 (LocalCommon)
  if (step === 2 && selectedType === 'regular') {
    return <LocalCommon onBack={() => setStep(1)} kakaoUserInfo={null} />;
  }

  // 3단계: 크리에이터 회원가입 폼 (LocalCreator)
  if (step === 3 && selectedType === 'creator') {
    return <LocalCreator onBack={() => setStep(1)} kakaoUserInfo={null} />;
  }

  // 기본값 (에러 방지)
  return null;
};
