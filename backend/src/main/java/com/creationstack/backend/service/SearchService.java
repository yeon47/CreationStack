package com.creationstack.backend.service;

import com.creationstack.backend.domain.search.Category;
import com.creationstack.backend.domain.search.Content;
import com.creationstack.backend.dto.search.*;
import com.creationstack.backend.repository.search.ContentRepository;
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
public class SearchService { // 검색 서비스

    private final ContentRepository contentRepository; // 콘텐츠 레포지토리

    // 통합 검색
    public IntegratedSearchResponse searchIntegrated(
            SearchDto dto, // 검색 조건 Dto
            String sortType) { // 정렬 기준

        // 크리에이터 3개
        Pageable creatorPageable = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, sortType));
        SearchResponse<SearchResultDto> creatorResult = searchCreator(dto, creatorPageable, sortType);
        //콘텐츠 6개
        Pageable contentPageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, sortType));
        SearchResponse<SearchResultDto> contentResult = searchContent(dto, contentPageable, sortType);

        //결과 묶기
        IntegratedSearchResponse response = new IntegratedSearchResponse();
        response.setCreators(creatorResult.getContents());
        response.setContents(contentResult.getContents());

        return response;
    }

    // 콘텐츠 + 크리에이터의 콘텐츠 검색
    public SearchResponse<SearchResultDto> searchContent(
            SearchDto dto, // 검색 조건 Dto
            Pageable pageable, // 페이징 정보
            String sortType) { // 정렬 기준

        dto.setSearchMode(SearchMode.CONTENT_ONLY);
        return searchFilter(dto, pageable, sortType);
    }

    // 크리에이터 검색
    public SearchResponse<SearchResultDto> searchCreator(
            SearchDto dto, // 검색 조건 Dto
            Pageable pageable, // 페이징 정보
            String sortType) { // 정렬 기준

        dto.setSearchMode(SearchMode.CREATOR_ONLY);
        return searchFilter(dto, pageable, sortType);
    }

    /*
    // 전체 검색
    public SearchResponse<SearchResultDto> searchAll(
            SearchDto dto, // 검색 조건 Dto
            Pageable pageable, // 페이징 정보
            String sortType) { // 정렬 기준

        dto.setSearchMode(SearchMode.ALL);
        return searchFilter(dto, pageable, sortType);
    }
    */

    // 검색조건으로 필터링 메소드, ContentSearchResponse<ContentListDto>로 반환
    public SearchResponse<SearchResultDto> searchFilter(
            SearchDto dto, // 검색 조건 Dto
            Pageable pageable, // 페이징 정보
            String sortType) { // 정렬 기준

        // 동적 쿼리를 위한 Specification
        Specification<Content> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>(); // 조건 담는 리스트

            if (dto.getCreatorId() != null) { // 크리에이터의 콘텐츠 검색 조건
                predicates.add(cb.equal(root.get("creator").get("userId"), dto.getCreatorId()));
            }

            // 크리에이터 닉네임, 제목, 내용 통합 키워드 검색
            if (dto.getKeyword() != null && !dto.getKeyword().trim().isEmpty()) {
                // 부분일치 검색을 위한 와일드카드 처리, 공백 제거로 실수 방지
                String keyword = "%" + dto.getKeyword().trim() + "%";

                List<Predicate> keywordPredicates = new ArrayList<>();
                switch (dto.getSearchMode()) { // 검색 모드

                    case CONTENT_ONLY -> { // 콘텐츠 검색
                        keywordPredicates.add(cb.like(root.get("title"), keyword)); // 제목으로 검색
                        keywordPredicates.add(cb.like(root.get("content"), keyword)); // 내용으로 검색
                    }
                    case CREATOR_ONLY -> { // 크리에이터 검색
                        keywordPredicates.add(cb.like(root.get("creator").get("userDetail").get("nickname"), keyword)); // 크리에이터 닉네임으로 검색
                        keywordPredicates.add(cb.like(root.get("creator").get("job").get("name"), keyword)); // 크리에이터 직업으로 검색
                    }
                    case ALL -> { // 통합 검색
                        keywordPredicates.add(cb.like(root.get("title"), keyword)); // 제목으로 검색
                        keywordPredicates.add(cb.like(root.get("content"), keyword)); // 내용으로 검색
                        keywordPredicates.add(cb.like(root.get("creator").get("userDetail").get("nickname"), keyword)); // 크리에이터 닉네임으로 검색
                        keywordPredicates.add(cb.like(root.get("creator").get("job").get("name"), keyword)); // 크리에이터 직업으로 검색
                    }
                }
                predicates.add(cb.or(keywordPredicates.toArray(new Predicate[0])));
                // 제목, 내용, 닉네임 중 하나라도 키워드 포함이면 검색
                // 직업 키워드 검색 추가
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
        Page<SearchResultDto> page = contentRepository.findAll(spec, sortedPageable)
                .map(content -> SearchResultDto.builder()

                        .contentId(content.getContentId()) // 콘텐츠 ID
                        .title(content.getTitle()) // 제목

                        .creator( // 크리에이터 정보
                                SearchCreatorDto.builder()
                                        .userId(content.getCreator().getUserId()) // 크리에이터 ID
                                        .nickname(content.getCreator().getUserDetail().getNickname()) // 크리에이터 닉네임
                                        .profileImageUrl(content.getCreator().getUserDetail().getProfileImageUrl()) // 크리에이터 섬네일
                                        .job(content.getCreator().getJob().getName()) // 크리에이터 직업
                                        .bio(content.getCreator().getUserDetail().getBio()) // 크리에이터 간단 자기소개
                                        .subscriberCount(content.getCreator().getSubscriberCount())
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

        // Page 객체에서 페이지 정보와 콘텐츠 리스트를 추출하여 SearchResponse로 변환
        return new SearchResponse<>(
                page.getNumber(), // 페이지 번호
                page.getSize(), // 한 페이지에 표시할 콘텐츠 수
                page.getTotalPages(), // 전체 페이지 수
                page.getTotalElements(), // 전체 검색 결과 수
                page.getContent() // 현재 페이지의 콘텐츠 리스트(List<T>)
        );
    }
}
