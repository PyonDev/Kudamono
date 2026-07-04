package com.nyanpan.kudamono.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nyanpan.kudamono.dto.CatalogItemRequest;
import com.nyanpan.kudamono.dto.CatalogItemResponse;
import com.nyanpan.kudamono.model.CatalogItem;
import com.nyanpan.kudamono.repository.CatalogRepository;

@Service
public class CatalogService {
    
    private final CatalogRepository catalogRepository;

    public CatalogService(CatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    public List<CatalogItemResponse> getAllCatalogItems() {
        return catalogRepository.findAll().stream()
        .map(item -> new CatalogItemResponse(
            item.getId(),
            item.getName(),
            item.getDescription(),
            item.getImageUrl(),
            item.getCategory(),
            item.getSource()
        )).collect(Collectors.toList());
    }

    public List<CatalogItemResponse> getCatalogItemsByCategory(String category) {
        return catalogRepository.findByCategory(category).stream()
        .map(item -> new CatalogItemResponse(
            item.getId(),
            item.getName(),
            item.getDescription(),
            item.getImageUrl(),
            item.getCategory(),
            item.getSource()
        )).collect(Collectors.toList());
    }

    public CatalogItemResponse saveCatalogItem(CatalogItemRequest request) {
        CatalogItem entity = new CatalogItem(
                request.getName(),
                request.getDescription(),
                request.getImageUrl(),
                request.getCategory(),
                request.getSource()
        );

        CatalogItem savedEntity = catalogRepository.save(entity);

        return new CatalogItemResponse(
                savedEntity.getId(),
                savedEntity.getName(),
                savedEntity.getDescription(),
                savedEntity.getImageUrl(),
                savedEntity.getCategory(),
                savedEntity.getSource()
        );
    }
}
