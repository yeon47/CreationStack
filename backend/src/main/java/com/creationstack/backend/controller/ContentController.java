package com.creationstack.backend.controller;

import com.creationstack.backend.dto.ContentSearchDto;
import com.creationstack.backend.dto.ContentSearchResponse;
import com.creationstack.backend.dto.ContentSearchResultListDto;
import com.creationstack.backend.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/contents")
public class ContentController {

    private final ContentService contentService;

    @GetMapping("/search")
    public String search(@ModelAttribute ContentSearchDto dto,
                               @PageableDefault(size = 12) Pageable pageable,
                               @RequestParam(value = "sort", defaultValue = "createdAt") String sortType,
                               Model model) {

        ContentSearchResponse<ContentSearchResultListDto> result = contentService.search(dto, pageable, sortType);

        model.addAttribute("contents", result);
        model.addAttribute("condition", dto);
        model.addAttribute("sort", sortType);
        return "search";
    }

}
