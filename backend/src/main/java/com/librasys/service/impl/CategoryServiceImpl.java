package com.librasys.service.impl;

import com.librasys.dto.CategoryDto;
import com.librasys.entity.Category;
import com.librasys.exception.ApiException;
import com.librasys.repository.CategoryRepository;
import com.librasys.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto createCategory(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Category with this name already exists!");
        }

        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());

        Category savedCategory = categoryRepository.save(category);
        return mapToDto(savedCategory);
    }

    @Override
    @Cacheable(value = "categories")
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found with id: " + id));
        return mapToDto(category);
    }

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found with id: " + id));

        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return mapToDto(updatedCategory);
    }

    @Override
    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    private CategoryDto mapToDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getDescription());
    }
}
