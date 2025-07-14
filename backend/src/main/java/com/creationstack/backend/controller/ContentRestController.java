package com.creationstack.backend.controller;

import com.creationstack.backend.dto.ContentSearchDto;
import com.creationstack.backend.dto.ContentSearchResponse;
import com.creationstack.backend.dto.ContentSearchResultListDto;
import com.creationstack.backend.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contents")
public class ContentRestController {

    private final ContentService contentService;

    @GetMapping("/search")
    public ContentSearchResponse<ContentSearchResultListDto> search(@ModelAttribute ContentSearchDto dto,
                                                                    @PageableDefault(size = 12) Pageable pageable,
                                                                    @RequestParam(value = "sort", defaultValue = "createdAt") String sortType) {

        return contentService.search(dto, pageable, sortType);
    }

}
