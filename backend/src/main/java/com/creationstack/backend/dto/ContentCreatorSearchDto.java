package com.creationstack.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ContentCreatorSearchDto {
    private Long userId;
    private String nickname;
    private String profileImageUrl;
}
