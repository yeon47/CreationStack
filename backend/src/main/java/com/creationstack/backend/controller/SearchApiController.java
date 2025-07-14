package com.creationstack.backend.controller;

import com.creationstack.backend.dto.SearchDto;
import com.creationstack.backend.dto.SearchResponse;
import com.creationstack.backend.dto.SearchResultDto;
import com.creationstack.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SearchApiController { // 검색 api 컨트롤러

    private final SearchService searchService;

    // 통합검색(제목 + 내용 + 닉네임 + 직업)
    @GetMapping("/contents/search")
    public SearchResponse<SearchResultDto> search(
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 12) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType) { // 정렬 조건

        return searchService.searchAll(dto, pageable, sortType);
    }

    // 콘텐츠 검색(제목 + 내용)
    @GetMapping("/contents")
    public SearchResponse<SearchResultDto> searchContent(
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 12) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType) { // 정렬 조건

        return searchService.searchContent(dto, pageable, sortType);
    }

    // 크리에이터 검색(닉네임 + 직업)
    @GetMapping("/creators")
    public SearchResponse<SearchResultDto> searchCreator(
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 12) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType) { // 정렬 조건

        return searchService.searchCreator(dto, pageable, sortType);
    }

    // 크리에이터의 콘텐츠 검색(제목 + 내용)
    @GetMapping("/creators/{creatorId}/contents")
    public SearchResponse<SearchResultDto> searchCreatorContent(
            @PathVariable Long creatorId, // 보고있는 크리에이터
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 12) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType) { // 정렬 조건

        dto.setCreatorId(creatorId); // 검색 대상 크리에이터 지정

        return searchService.searchContent(dto, pageable, sortType);
    }

}
