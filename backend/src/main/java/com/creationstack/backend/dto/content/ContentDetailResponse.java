package com.creationstack.backend.dto.content;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ContentDetailResponse {
    private Long contentId;
    private String title;
    private String content;
    private String thumbnailUrl;

    private Long creatorId;
    private String creatorNickname;
    private String creatorProfileImageUrl;

    private int viewCount;
    private int likeCount;
    private int commentCount;

    private List<String> attachmentUrls; // 첨부파일 리스트

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
