package com.nyanpan.kudamono.controller;

import java.util.List;

import com.nyanpan.kudamono.dto.CatalogItemRequest;
import com.nyanpan.kudamono.dto.CatalogItemResponse;
import com.nyanpan.kudamono.service.CatalogService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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

    @GetMapping("/{name}")
    public ResponseEntity<CatalogItemResponse> getCatalogItemByName(@PathVariable String name) {
        return catalogService.getCatalogItemByName(name)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public CatalogItemResponse createItem(@RequestBody CatalogItemRequest request) {
        return catalogService.saveCatalogItem(request);
    }
}
