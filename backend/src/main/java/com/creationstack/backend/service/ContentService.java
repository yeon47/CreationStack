package com.creationstack.backend.service;

import com.creationstack.backend.domain.Category;
import com.creationstack.backend.domain.Content;
import com.creationstack.backend.dto.ContentCreatorSearchDto;
import com.creationstack.backend.dto.ContentSearchDto;
import com.creationstack.backend.dto.ContentSearchResponse;
import com.creationstack.backend.dto.ContentSearchResultListDto;
import com.creationstack.backend.repository.ContentRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService { // 콘텐츠 서비스

    private final ContentRepository contentRepository; // 콘텐츠 레포지토리

    // 검색조건으로 필터링 메소드, Page<ContentListDto>로 반환
    public ContentSearchResponse<ContentSearchResultListDto> search(ContentSearchDto dto, // 검색 조건 Dto
                                                                    Pageable pageable, // 페이징 정보
                                                                    String sortType) { // 정렬 기준

        // 동적 쿼리를 위한 Specification
        Specification<Content> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>(); // 조건 담는 리스트

            // 크리에이터 닉네임, 제목, 내용 통합 키워드 검색
            if (dto.getKeyword() != null && !dto.getKeyword().trim().isEmpty()) {
                // 부분일치 검색을 위한 와일드카드 처리, 공백 제거로 실수 방지
                String keyword = "%" + dto.getKeyword().trim() + "%";
                Predicate title = cb.like(root.get("title"), keyword); // 제목으로 검색
                Predicate content = cb.like(root.get("content"), keyword); // 내용으로 검색
                Predicate nickname = cb.like(root.get("creator").get("nickname"), keyword); // 크리에이터 닉네임으로 검색
                predicates.add(cb.or(title, content, nickname)); // 제목, 내용, 닉네임 중 하나라도 키워드 포함이면 검색
            }

            // 유/무료 조건
            if (dto.getAccessType() != null) {
                predicates.add(cb.equal(root.get("accessType"), dto.getAccessType()));
            }

            // 카테고리 조건
            if (dto.getCategories() != null && !dto.getCategories().isEmpty()) {
                Join<Content, Category> join = root.join("categories", JoinType.INNER);
                predicates.add(join.get("categoryId").in(dto.getCategories()));
            }

            // 모든 조건을 AND로 묶어서 반환
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        // 정렬 조건 커스터마이징
        Sort sort = switch (sortType) {
            case "like" -> Sort.by(Sort.Direction.DESC, "likeCount"); // 좋아요순
            case "createdAt" -> Sort.by(Sort.Direction.DESC, "createdAt"); // 최신순
            default -> Sort.by(Sort.Direction.DESC, "createdAt"); // 기본값 최신순
        };

        // 정렬조건 바꿔서 적용
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);

        // 조건에 맞는 콘텐츠 리스트를 페이징해서 가져오고 map을 이용해서 Dto로 변환
        Page<ContentSearchResultListDto> page = contentRepository.findAll(spec, sortedPageable)
                .map(content -> ContentSearchResultListDto.builder()

                        .contentId(content.getContentId()) // 콘텐츠 ID
                        .title(content.getTitle()) // 제목

                        .creator( // 크리에이터 정보
                                ContentCreatorSearchDto.builder()
                                        .userId(content.getCreator().getUserId()) // 크리에이터 ID
                                        .nickname(content.getCreator().getNickname()) // 크리에이터 닉네임
                                        .profileImageUrl(content.getCreator().getProfileImageUrl()) // 크리에이터 섬네일
                                        .build())

                        .thumbnailUrl(content.getThumbnailUrl()) // 섬네일 Url
                        .accessType(content.getAccessType()) // 유/무료 여부
                        .viewCount(content.getViewCount()) // 조회수
                        .likeCount(content.getLikeCount()) // 좋아요수
                        .commentCount(content.getCommentCount()) // 댓글수
                        .createdAt(content.getCreatedAt()) // 작성일

                        .categoryNames( // 카테고리 이름 목록
                                content.getCategories().stream()
                                        .map(Category::getName)
                                        .toList())
                        .build()
                );

        return new ContentSearchResponse<>(
                page.getNumber(),
                page.getSize(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.getContent()
        );
    }
}
