import React, { useState } from 'react';
import { Card, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/Select';
import './localcreator.css';

export const LocalCreator = ({ onBack, kakaoUserInfo }) => {
  const [selectedJob, setSelectedJob] = useState('');

  return (
    <div
      className="localcreator-section flex flex-col h-[1200px] items-center gap-10 px-0 py-20 relative bg-white"
      data-model-id="278:2855">
      <Card className="flex flex-col items-start gap-[25px] p-10 rounded-[40px] border border-solid border-white shadow-[0px_4px_4px_#00000040,0px_4px_4px_#00000040,0px_4px_4px_#00000040,0px_4px_35px_#00000040,0px_4px_4px_#00000040] overflow-hidden">
        <CardContent className="p-0">
          <div className="flex w-[459px] h-[114px] items-start relative overflow-hidden">
            <div className="flex flex-col w-[353px] items-start gap-5 relative">
              <div className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-[21px] tracking-[0] leading-[31.5px] whitespace-nowrap">
                <span className="text-black">Welcome to </span>
                <span className="font-bold text-[#4682a9]">창조스택</span>
              </div>
              <div className="relative w-fit font-['Poppins',Helvetica] font-medium text-black text-[55px] tracking-[0] leading-[55px] whitespace-nowrap">
                회원가입
              </div>
            </div>
            <div className="relative w-[110px] h-11">
              <div className="absolute top-0 left-0 font-['Poppins',Helvetica] font-normal text-[#8d8d8d] text-[13px] text-right tracking-[0] leading-[19.5px] whitespace-nowrap">
                계정이 있으신가요?
              </div>
              <div
                className="absolute top-6 left-[70px] font-['Poppins',Helvetica] font-normal text-[#4682a9] text-[13px] text-right tracking-[0] leading-[19.5px] whitespace-nowrap cursor-pointer hover:underline"
                onClick={() => (window.location.href = '/api/auth/login')}>
                로그인
              </div>
            </div>
          </div>
          <div className="inline-flex flex-col items-start gap-[25px] px-px py-0 relative">
            {/* 카카오 로그인이 아닐 때만 이메일 필드 표시 */}
            {!kakaoUserInfo && (
              <div className="inline-flex flex-col items-start gap-2.5 relative">
                <div className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap">
                  <span className="text-black">이메일 주소 </span>
                  <span className="text-[#ff0000]">*</span>
                </div>
                <div className="flex w-[459px] h-[58px] items-center gap-2.5 relative">
                  <Input
                    className="h-[58px] flex-1 rounded-[9px] border-[#749bc2] placeholder:text-[#999999] placeholder:text-sm font-['Poppins',Helvetica]"
                    placeholder="이메일 주소를 입력해주세요"
                  />
                  <Button className="w-44 h-[58px] bg-[#4682a9] opacity-50 rounded-[9px] font-['Poppins',Helvetica] font-medium text-white text-sm">
                    중복 확인
                  </Button>
                </div>
              </div>
            )}

            {/* Name field */}
            <div className="inline-flex flex-col items-start gap-2.5 relative">
              <div className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap">
                <span className="text-black">이름 </span>
                <span className="text-[#ff0000]">*</span>
                <span className="text-black">&nbsp;</span>
              </div>
              <Input
                className="w-[459px] h-[58px] px-5 rounded-[9px] border-[#adadad] placeholder:text-[#999999] placeholder:text-sm font-['Poppins',Helvetica]"
                placeholder="이름을 입력해주세요"
              />
            </div>

            {/* Nickname field */}
            <div className="inline-flex flex-col items-start gap-2.5 relative">
              <div className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                <span className="text-black">닉네임 </span>
                <span className="text-[#ff0000]">*</span>
              </div>
              <Input
                className="w-[459px] h-[58px] px-5 rounded-[9px] border-[#adadad] placeholder:text-[#999999] placeholder:text-sm font-['Poppins',Helvetica]"
                placeholder={kakaoUserInfo?.nickname || '닉네임을 입력해주세요'}
                defaultValue={kakaoUserInfo?.nickname || ''}
              />
            </div>

            {/* Job/Occupation dropdown */}
            <div className="inline-flex flex-col items-start gap-2 relative">
              <div className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-base tracking-[0] leading-6 whitespace-nowrap">
                <span className="text-black">직업 </span>
                <span className="text-[#ff0000]">*</span>
              </div>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger className="w-[459px] h-[58px] px-5 !bg-white rounded-[9px] font-['Poppins',Helvetica] font-normal text-black text-sm border border-[#adadad] focus:border-[#749bc2]">
                  <SelectValue placeholder="직업을 선택해주세요" />
                </SelectTrigger>
                <SelectContent className="!bg-white">
                  <SelectItem value="developer">개발자</SelectItem>
                  <SelectItem value="designer">디자이너</SelectItem>
                  <SelectItem value="manager">매니저</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 카카오 로그인이 아닐 때만 비밀번호 필드들 표시 */}
            {!kakaoUserInfo && (
              <>
                {/* Password field */}
                <div className="inline-flex flex-col items-start gap-2.5 relative">
                  <div className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                    <span className="text-black">비밀번호 </span>
                    <span className="text-[#ff0000]">*</span>
                  </div>
                  <Input
                    type="password"
                    className="w-[459px] h-[58px] px-5 rounded-[9px] border-[#adadad] placeholder:text-[#999999] placeholder:text-sm font-['Poppins',Helvetica]"
                    placeholder="비밀번호를 입력해주세요"
                  />
                </div>

                {/* Password confirmation field */}
                <div className="inline-flex flex-col items-start gap-2.5 relative">
                  <div className="relative w-fit mt-[-1.00px] font-['Poppins',Helvetica] font-normal text-base text-center tracking-[0] leading-6 whitespace-nowrap">
                    <span className="text-black">비밀번호 확인 </span>
                    <span className="text-[#ff0000]">*</span>
                  </div>
                  <Input
                    type="password"
                    className="w-[459px] h-[58px] px-5 rounded-[9px] border-[#adadad] placeholder:text-[#999999] placeholder:text-sm font-['Poppins',Helvetica]"
                    placeholder="비밀번호를 입력해주세요"
                  />
                </div>
              </>
            )}
          </div>
          {/* Sign up button */}
          <div className="flex flex-col w-[461px] items-center gap-2.5 px-0 py-[30px] relative overflow-hidden">
            <div className="inline-flex flex-col items-start gap-2.5 px-px py-0 relative ml-[-1.00px] mr-[-1.00px] space-y-4">
              <div className="flex gap-4 w-full">
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 h-[55px] border-[#4682a9] text-[#4682a9] rounded-[10px] font-['Poppins',Helvetica] font-medium text-base hover:bg-[#4682a9] hover:text-white">
                  이전
                </Button>
                <Button className="flex-1 h-[55px] bg-[#4682a9] rounded-[10px] font-['Poppins',Helvetica] font-medium text-white text-base hover:bg-[#3a6d89]">
                  회원가입
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
