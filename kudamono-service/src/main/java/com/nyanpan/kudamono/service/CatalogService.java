package com.nyanpan.kudamono.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.stereotype.Service;

import com.nyanpan.kudamono.dto.CatalogItemRequest;
import com.nyanpan.kudamono.dto.CatalogItemResponse;
import com.nyanpan.kudamono.model.CatalogItem;
import com.nyanpan.kudamono.repository.CatalogRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;

@Service
public class CatalogService {
    
    private final CatalogRepository catalogRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public CatalogService(CatalogRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    public List<CatalogItemResponse> getAllCatalogItems() {
        return catalogRepository.findAll().stream()
        .map(item -> new CatalogItemResponse(
            item.getId(),
            item.getName(),
            item.getSeries(),
            item.getImageUrl(),
            item.getTags()
        )).collect(Collectors.toList());
    }

    public List<CatalogItemResponse> getCatalogItemsBySeries(String series) {
        return catalogRepository.findBySeries(series).stream()
        .map(item -> new CatalogItemResponse(
            item.getId(),
            item.getName(),
            item.getSeries(),
            item.getImageUrl(),
            item.getTags()
        )).collect(Collectors.toList());
    }

    public Optional<CatalogItemResponse> getCatalogItemByName(String name) {
        return catalogRepository.findByNameIgnoreCase(name)
        .map(item -> new CatalogItemResponse(
            item.getId(),
            item.getName(),
            item.getSeries(),
            item.getImageUrl(),
            item.getTags()
        ));
    }

    public String getRandomName() {
        Aggregation aggregation = Aggregation.newAggregation(
            Aggregation.sample(1),
            Aggregation.project("name")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(
            aggregation, "catalog_items", Map.class
        );

        List<Map> mappedResults = results.getMappedResults();
        if(!mappedResults.isEmpty()) {
            return mappedResults.get(0).get("name").toString();
        }
        return "";
    }

    public CatalogItemResponse saveCatalogItem(CatalogItemRequest request) {
        CatalogItem entity = new CatalogItem(
                request.getName(),
                request.getSeries(),
                request.getImageUrl(),
                request.getTags()
        );

        CatalogItem savedEntity = catalogRepository.save(entity);

        return new CatalogItemResponse(
                savedEntity.getId(),
                savedEntity.getName(),
                savedEntity.getSeries(),
                savedEntity.getImageUrl(),
                savedEntity.getTags()
        );
    }
}
