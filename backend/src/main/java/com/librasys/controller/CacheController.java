package com.librasys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/admin/cache")
@PreAuthorize("hasRole('ADMIN')")
public class CacheController {

    private final CacheManager cacheManager;

    @Autowired
    public CacheController(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCacheStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        Collection<String> cacheNames = cacheManager.getCacheNames();
        stats.put("totalCaches", cacheNames.size());

        List<Map<String, String>> cacheDetails = new ArrayList<>();
        for (String name : cacheNames) {
            Map<String, String> detail = new LinkedHashMap<>();
            detail.put("name", name);
            detail.put("status", cacheManager.getCache(name) != null ? "ACTIVE" : "INACTIVE");
            cacheDetails.add(detail);
        }
        stats.put("caches", cacheDetails);
        return ResponseEntity.ok(stats);
    }

    @DeleteMapping("/evict/{cacheName}")
    public ResponseEntity<Map<String, String>> evictCache(@PathVariable String cacheName) {
        org.springframework.cache.Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "FAILED",
                    "message", "Cache '" + cacheName + "' not found. Available: " + cacheManager.getCacheNames()
            ));
        }
        cache.clear();
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Cache '" + cacheName + "' evicted successfully."
        ));
    }

    @DeleteMapping("/evict-all")
    public ResponseEntity<Map<String, String>> evictAllCaches() {
        Collection<String> cacheNames = cacheManager.getCacheNames();
        for (String name : cacheNames) {
            org.springframework.cache.Cache cache = cacheManager.getCache(name);
            if (cache != null) {
                cache.clear();
            }
        }
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "All caches evicted. Count: " + cacheNames.size()
        ));
    }
}
