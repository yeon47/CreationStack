import React from 'react';
import { Button } from '../../components/Button';
import { Card, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import './LocalCommon.css';

export const LocalCommon = ({ onBack, kakaoUserInfo }) => {
  // Form field data with labels and placeholders
  const formFields = [
    // 카카오 로그인이 아닐 때만 이메일 필드 표시
    ...(kakaoUserInfo
      ? []
      : [
          {
            id: 'email',
            label: '이메일 주소',
            placeholder: '이메일 주소를 입력해주세요',
            required: true,
            hasButton: true,
            buttonText: '중복 확인',
          },
        ]),
    {
      id: 'name',
      label: '이름',
      placeholder: '이름을 입력해주세요',
      required: true,
    },
    {
      id: 'nickname',
      label: '닉네임',
      placeholder: kakaoUserInfo?.nickname || '닉네임을 입력해주세요',
      required: true,
      defaultValue: kakaoUserInfo?.nickname || '',
    },
    // 카카오 로그인이 아닐 때만 비밀번호 필드들 표시
    ...(kakaoUserInfo
      ? []
      : [
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
        ]),
  ];

  return (
    <div
      className="localcommon-section flex flex-col h-[1100px] items-center gap-10 px-0 py-20 relative bg-white"
      data-model-id="212:1503">
      <Card className="w-[539px] h-[900px] p-10 rounded-[40px] border border-white shadow-[0px_4px_4px_#00000040,0px_4px_4px_#00000040,0px_4px_4px_#00000040,0px_4px_35px_#00000040,0px_4px_4px_#00000040] overflow-hidden">
        <CardContent className="p-0 space-y-[25px]">
          {/* Header Section */}
          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col gap-5">
              <div className="font-['Poppins',Helvetica] text-[21px] leading-[31.5px]">
                <span>Welcome to </span>
                <span className="font-bold text-[#4682a9]">창조스택</span>
              </div>
              <div className="font-['Poppins',Helvetica] font-medium text-[55px] leading-[55px]">회원가입</div>
            </div>

            <div className="text-right">
              <div className="font-['Poppins',Helvetica] text-[13px] text-[#8d8d8d] leading-[19.5px]">
                계정이 있으신가요?
              </div>
              <div
                className="font-['Poppins',Helvetica] text-[13px] text-[#4682a9] leading-[19.5px] cursor-pointer hover:underline"
                onClick={() => (window.location.href = '/api/auth/login')}>
                로그인
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-[25px]">
            {formFields.map(field => (
              <div key={field.id} className="flex flex-col gap-2.5">
                <Label htmlFor={field.id} className="font-['Poppins',Helvetica] font-normal text-base">
                  {field.label} {field.required && <span className="text-[#ff0000]">*</span>}
                </Label>

                {field.hasButton ? (
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-[58px] rounded-[9px] border border-[#749bc2] overflow-hidden">
                      <Input
                        id={field.id}
                        placeholder={field.placeholder}
                        className="h-full border-none font-['Poppins',Helvetica] text-sm placeholder:text-[#999999] placeholder:text-sm"
                      />
                    </div>
                    <Button className="w-44 h-[58px] bg-[#4682a9] opacity-50 rounded-[9px] font-['Poppins',Helvetica] font-medium text-sm">
                      {field.buttonText}
                    </Button>
                  </div>
                ) : (
                  <div className="h-[58px] rounded-[9px] border border-[#adadad] overflow-hidden">
                    <Input
                      id={field.id}
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      defaultValue={field.defaultValue || ''}
                      className="h-full border-none font-['Poppins',Helvetica] text-sm placeholder:text-[#999999] placeholder:text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-[30px] space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1 h-[55px] border-[#4682a9] text-[#4682a9] rounded-[10px] font-['Poppins',Helvetica] font-medium text-base hover:bg-[#4682a9] hover:text-white">
                이전
              </Button>
              <Button className="flex-1 h-[55px] bg-[#4682a9] rounded-[10px] font-['Poppins',Helvetica] font-medium text-base hover:bg-[#3a6d89]">
                회원가입
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
