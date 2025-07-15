package com.creationstack.backend.controller;

import com.creationstack.backend.dto.IntegratedSearchResponse;
import com.creationstack.backend.dto.SearchDto;
import com.creationstack.backend.dto.SearchResponse;
import com.creationstack.backend.dto.SearchResultDto;
import com.creationstack.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    // 전체검색(콘텐츠 + 크리에이터)
    @GetMapping("/contents/search")
    public String search(
            @ModelAttribute SearchDto dto, // 검색 조건
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType, // 정렬 조건
            Model model) { // 모델

        // 서비스에서 통합 검색 결과 받아옴
        IntegratedSearchResponse result = searchService.searchIntegrated(dto, sortType);

        model.addAttribute("contentResult", result.getContents());
        model.addAttribute("creatorResult", result.getCreators());
        model.addAttribute("condition", dto);
        model.addAttribute("sort", sortType);
        return "search"; // 모델에 검색 결과 및 조건 추가 후 뷰 렌더링
    }

    // 콘텐츠 검색(제목 + 내용)
    @GetMapping("/contents")
    public String searchContent(
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 9) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType, // 정렬 조건
            Model model) { // 모델

        // 검색 결과를 서비스로부터 받아옴
        SearchResponse<SearchResultDto> result = searchService.searchContent(dto, pageable, sortType);

        model.addAttribute("contents", result);
        model.addAttribute("condition", dto);
        model.addAttribute("sort", sortType);
        return "content_search"; // 모델에 검색 결과 및 조건 추가 후 뷰 렌더링
    }

    // 크리에이터 검색(닉네임 + 직업)
    @GetMapping("/creators")
    public String searchCreator(
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 9) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType, // 정렬 조건
            Model model) { // 모델

        // 검색 결과를 서비스로부터 받아옴
        SearchResponse<SearchResultDto> result = searchService.searchCreator(dto, pageable, sortType);

        model.addAttribute("contents", result);
        model.addAttribute("condition", dto);
        model.addAttribute("sort", sortType);
        return "creator_search"; // 모델에 검색 결과 및 조건 추가 후 뷰 렌더링
    }

    /*
    // 전체검색(제목 + 내용 + 닉네임 + 직업)
    @GetMapping("/contents/search")
    public String search(
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 9) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType, // 정렬 조건
            Model model) { // 모델

        // 검색 결과를 서비스로부터 받아옴
        SearchResponse<SearchResultDto> result = searchService.searchAll(dto, pageable, sortType);

        model.addAttribute("contents", result);
        model.addAttribute("condition", dto);
        model.addAttribute("sort", sortType);
        return "search"; // 모델에 검색 결과 및 조건 추가 후 뷰 렌더링
    }

    // 크리에이터의 콘텐츠 검색(제목 + 내용)
    @GetMapping("/creators/{creatorId}/contents")
    public String searchCreatorContent(
            @PathVariable Long creatorId, // 보고있는 크리에이터
            @ModelAttribute SearchDto dto, // 검색 조건
            @PageableDefault(size = 9) Pageable pageable, // 페이징
            @RequestParam(value = "sort", defaultValue = "createdAt") String sortType, // 정렬 조건
            Model model) { // 모델

        dto.setCreatorId(creatorId); // 검색 대상 크리에이터 지정
        // 검색 결과를 서비스로부터 받아옴
        SearchResponse<SearchResultDto> result = searchService.searchContent(dto, pageable, sortType);

        model.addAttribute("contents", result);
        model.addAttribute("condition", dto);
        model.addAttribute("sort", sortType);
        return "creator_content_search"; // 모델에 검색 결과 및 조건 추가 후 뷰 렌더링
    }
    */


}
