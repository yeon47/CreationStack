package com.creationstack.backend.controller;

import com.creationstack.backend.domain.user.User;
import com.creationstack.backend.dto.notice.*;
import com.creationstack.backend.service.notice.NoticeService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/creators/{creatorId}/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping
    public ResponseEntity<NoticeResponseDto> createNotice(
            @PathVariable Long creatorId,
            @RequestBody NoticeCreateDto dto,
            @AuthenticationPrincipal User user) {
        dto.setCreatorId(creatorId);
        return ResponseEntity.ok(noticeService.createNotice(dto, user));
    }

    @GetMapping
    public ResponseEntity<List<NoticeResponseDto>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<NoticeDetailDto> getNotice(
            @PathVariable Long creatorId,
            @PathVariable Long noticeId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noticeService.getNotice(noticeId, user));
    }

    @PutMapping("/{noticeId}")
    public ResponseEntity<NoticeResponseDto> updateNotice(
            @PathVariable Long creatorId,
            @PathVariable Long noticeId,
            @RequestBody NoticeUpdateDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noticeService.updateNotice(noticeId, dto, user));
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<Void> deleteNotice(
            @PathVariable Long creatorId,
            @PathVariable Long noticeId,
            @AuthenticationPrincipal User user) {
        noticeService.deleteNotice(noticeId, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{noticeId}/reaction")
    public ResponseEntity<Void> reactToNotice(
            @PathVariable Long creatorId,
            @PathVariable Long noticeId,
            @RequestParam String emoji,
            @AuthenticationPrincipal User user) {
        noticeService.reactToNotice(noticeId, user, emoji);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{noticeId}/reaction")
    public ResponseEntity<List<NoticeReactionDto>> getReactions(
            @PathVariable Long creatorId,
            @PathVariable Long noticeId) {
        return ResponseEntity.ok(noticeService.getReactions(noticeId));
    }
}
