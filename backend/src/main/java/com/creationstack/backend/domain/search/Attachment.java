package com.creationstack.backend.domain.search;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@Table(name = "attachments")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Attachment { // 첨부파일 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long attachmentId; // 첨부파일 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content; // 해당 첨부파일이 연결된 콘텐츠

    @Column(name = "file_url", length = 512, nullable = false)
    private String fileUrl; // 첨부파일 Url

    @Column(name = "original_file_name", length = 100)
    private String originalFileName; // 첨부파일 원본 이름

    @Column(name = "stored_file_name", length = 255, nullable = false)
    private String storedFileName; // 첨부파일 저장된 이름

    @Column(name = "file_type", length = 50, nullable = false)
    private String fileType; // 첨부파일 타입

    @Column(name = "file_size")
    private Long fileSize; // 첨부파일 크기
}
