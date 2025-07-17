package com.creationstack.backend.dto;

import com.creationstack.backend.domain.user.User;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "실명은 필수 입력값입니다.")
    @Size(min = 2, max = 50, message = "실명은 2-50자 사이여야 합니다.")
    @Pattern(regexp = "^[가-힣a-zA-Z\\s]+$", message = "실명은 한글, 영문, 공백만 포함할 수 있습니다.")
    private String username;

    @NotBlank(message = "닉네임은 필수 입력값입니다.")
    @Size(min = 2, max = 50, message = "닉네임은 2-50자 사이여야 합니다.")
    @Pattern(regexp = "^[가-힣a-zA-Z0-9_-]+$", message = "닉네임은 한글, 영문, 숫자, _, - 만 포함할 수 있습니다.")
    private String nickname;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    @Size(max = 100, message = "이메일은 100자 이하여야 합니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    @Size(min = 8, max = 128, message = "비밀번호는 8-128자 사이여야 합니다.")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$", message = "비밀번호는 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.")
    private String password;

    @NotNull(message = "역할은 필수 선택값입니다.")
    private User.UserRole role;

    @Min(value = 1, message = "올바른 직업 ID를 선택해주세요.")
    private Integer jobId;

    @Size(max = 500, message = "소개글은 500자 이하여야 합니다.")
    private String bio;

    // 크리에이터인 경우 직업 ID 필수 검증
    @AssertTrue(message = "크리에이터는 직업을 선택해야 합니다.")
    private boolean isJobIdValidForCreator() {
        if (role == User.UserRole.CREATOR) {
            return jobId != null && jobId > 0;
        }
        return true;
    }
}
