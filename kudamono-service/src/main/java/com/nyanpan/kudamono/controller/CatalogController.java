package com.nyanpan.kudamono.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nyanpan.kudamono.dto.CatalogItemRequest;
import com.nyanpan.kudamono.dto.CatalogItemResponse;
import com.nyanpan.kudamono.service.CatalogService;

@RestController // We handle HTTP REST
@RequestMapping("/api/v1/catalog") // Base URL
@CrossOrigin(origins = "*") // Next.js compatibility
public class CatalogController {
    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<CatalogItemResponse> getAllCatalogItems() {
        return catalogService.getAllCatalogItems();
    }

    @PostMapping
    public CatalogItemResponse createItem(@RequestBody CatalogItemRequest request) {
        return catalogService.saveCatalogItem(request);
    }
}
