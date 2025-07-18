package com.creationstack.backend.dto.content;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import com.creationstack.backend.domain.content.AccessType;
import com.creationstack.backend.domain.content.Content;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentList  {
    private Long contentId;
    private String title;
    private String creatorName;
    private String job;
    private String category;
    private String thumbnailUrl;
    private Boolean isPaid;
    private int viewCount;
    private LocalDateTime createdAt;
    
    public static ContentList from(Content content) {
        String jobName = content.getCreator().getUserDetail().getJob() != null
            ? content.getCreator().getUserDetail().getJob().getName()
            : null;

        String categoryName = content.getCategoryMappings().isEmpty()
            ? null
            : content.getCategoryMappings().iterator().next().getCategory().getName();

        return new ContentList(
            content.getContentId(),
            content.getTitle(),
            content.getCreator().getUserDetail().getNickname(),
            jobName,
            categoryName,
            content.getThumbnailUrl(),
            content.getAccessType() == AccessType.SUBSCRIBER, 
            content.getViewCount(),
            content.getCreatedAt()
        );
    }


}


