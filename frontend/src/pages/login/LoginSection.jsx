import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Card, CardContent } from '../../components/Card';
import { Input } from '../../components/Input';
import { Label } from '../../components/Label';
import axios from 'axios';
import './login.css';

export const LoginSection = () => {
  const navigate = useNavigate();

  const leftSideContent = {
    title: '로그인',
    subtitle: '개발자 커뮤니티',
    description:
      '실무 경험과 지식을 공유하고 수익을 창출하며, 취업 준비생들이 이를 구독하여 실질적인 커리어 성장을 이룰 수 있도록 돕는 정적 콘텐츠 기반의 구독형 플랫폼입니다',
  };

  const handleSignupClick = () => {
    console.log('회원가입 버튼 클릭됨');
    navigate('/api/users');
  };

  // 카카오 로그인 - 카카오 OAuth URL로 리다이렉트
  const handleKakaoLogin = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URI}&response_type=code`;

    window.location.href = KAKAO_AUTH_URL;
  };

  // 이메일 로그인 함수
  const handleEmailLogin = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        console.log('로그인 성공');
        localStorage.setItem('accessToken', response.data.token);
        window.location.href = '/dashboard';
      } else {
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-section bg-white flex flex-row justify-center w-full" data-model-id="70:46">
      <div className="bg-white w-[1440px] h-[900px]">
        <div className="relative h-[819px]">
          {/* Blue background section */}
          <div className="absolute w-[1440px] h-[458px] top-0 left-0 bg-[#4682a9]" />

          {/* Login card */}
          <Card className="flex flex-col w-[542px] items-center justify-center gap-[60px] px-0 py-[60px] absolute top-[79px] left-[783px] bg-white rounded-[40px] border border-solid shadow-[0px_4px_4px_#00000040]">
            <CardContent className="p-0 w-full flex flex-col items-center gap-[60px]">
              {/* Header section with welcome text and signup link */}
              <div className="inline-flex items-start relative flex-[0_0_auto] w-full px-[45px]">
                <div className="flex flex-col w-[340px] items-start gap-px relative">
                  <div className="relative self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-[21px] tracking-[0] leading-[normal]">
                    <span className="text-black">Welcome to </span>
                    <span className="font-bold text-[#4682a9]">창조스택</span>
                  </div>
                  <div className="relative self-stretch [font-family:'Poppins',Helvetica] font-medium text-black text-[55px] tracking-[0] leading-[normal]">
                    로그인
                  </div>
                </div>

                <div className="inline-flex flex-col items-end relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-normal text-[#8d8d8d] text-[13px] tracking-[0] leading-[normal]">
                    계정이 없으신가요?
                  </div>
                  <Button
                    variant="link"
                    onClick={handleSignupClick}
                    className="h-auto p-0 [font-family:'Poppins',Helvetica] font-normal text-[#4682a9] text-[13px] tracking-[0] leading-[normal]">
                    회원가입
                  </Button>
                </div>
              </div>

              {/* Kakao login button */}
              <Button
                onClick={handleKakaoLogin}
                className="flex w-[451px] h-14 items-center justify-center gap-4 p-[30px] relative bg-[#fee500] rounded-xl text-black hover:bg-[#fee500]/90">
                <img
                  className="relative w-9 h-9 mt-[-20.00px] mb-[-20.00px]"
                  alt="Icon kakao"
                  src="https://c.animaapp.com/md45lq6rQTeTYg/img/icon---kakao.svg"
                />
                <span className="relative w-fit mt-[-25.00px] mb-[-23.00px] [font-family:'Poppins',Helvetica] font-normal text-[29px] tracking-[0] leading-[normal]">
                  카카오로 로그인하기
                </span>
              </Button>

              {/* Email and password inputs */}
              <div className="inline-flex flex-col items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
                <div className="relative w-[451px] h-[92px]">
                  <Label
                    htmlFor="email"
                    className="absolute top-[-3px] left-0 [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal]">
                    이메일 주소
                  </Label>
                  <Input
                    id="email"
                    placeholder="이메일 주소를 입력해주세요"
                    className="absolute w-[451px] h-[57px] top-[35px] left-0 bg-white rounded-[9px] border border-solid border-[#4285f4] pl-6 [font-family:'Poppins',Helvetica] font-light text-[#7f7f7f] text-sm"
                  />
                </div>

                <div className="relative w-[451px] h-[92px]">
                  <Label
                    htmlFor="password"
                    className="absolute top-[-3px] left-0 [font-family:'Poppins',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal]">
                    비밀번호
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    className="absolute w-[451px] h-[57px] top-[35px] left-0 bg-white rounded-[9px] border border-solid border-[#adadad] pl-6 [font-family:'Poppins',Helvetica] font-light text-[#7f7f7f] text-sm"
                  />
                </div>
              </div>

              {/* Login button */}
              <Button
                onClick={handleEmailLogin}
                className="relative w-[451px] h-[54px] bg-[#4682a9] rounded-[10px] shadow-[0px_4px_19px_#7793414c] text-white hover:bg-[#4682a9]/90 [font-family:'Poppins',Helvetica] font-medium text-base">
                로그인
              </Button>
            </CardContent>
          </Card>

          {/* Left side content with logo and description */}
          <div className="flex w-[714px] items-start gap-2.5 absolute top-0 left-0 overflow-hidden">
            <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
              {/* Logo */}
              <div className="inline-flex items-center gap-2.5 p-5 relative flex-[0_0_auto]">
                <div className="relative w-[107px] h-[107px] bg-[url(https://c.animaapp.com/md45lq6rQTeTYg/img/mask-group.png)] bg-[100%_100%]">
                  <div className="relative h-[107px] bg-[url(https://c.animaapp.com/md45lq6rQTeTYg/img/mask-group-2.svg)] bg-[100%_100%]">
                    <img
                      className="absolute w-[107px] h-[107px] top-0 left-0"
                      alt="Mask group"
                      src="https://c.animaapp.com/md45lq6rQTeTYg/img/mask-group-1.svg"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col w-[380px] h-[203px] items-start gap-2.5 px-[70px] py-5 relative">
                <div className="inline-flex items-start gap-2.5 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] [font-family:'Poppins',Helvetica] font-semibold text-white text-[34px] tracking-[0] leading-[normal]">
                    {leftSideContent.title}
                  </div>
                </div>

                <div className="flex w-[250px] h-9 items-center gap-2.5 relative mr-[-10.00px]">
                  <div className="relative w-[396px] mt-[-1.00px] mr-[-146.00px] [font-family:'Poppins',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                    {leftSideContent.subtitle}
                  </div>
                </div>

                <div className="flex flex-col w-[310px] items-center justify-center relative flex-[0_0_auto] mb-[-59.00px] mr-[-70.00px] overflow-hidden">
                  <div className="relative w-[311px] h-[115px] mt-[-1.00px] ml-[-0.50px] mr-[-0.50px] [font-family:'Poppins',Helvetica] font-light text-white text-[13px] tracking-[0] leading-[normal]">
                    {leftSideContent.description}
                  </div>
                </div>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative w-[385px] h-[385px]">
              <img
                className="absolute w-[324px] h-[385px] top-0 left-0 object-cover"
                alt="Saly"
                src="https://c.animaapp.com/md45lq6rQTeTYg/img/saly-1.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
