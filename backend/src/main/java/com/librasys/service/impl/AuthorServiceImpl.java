package com.librasys.service.impl;

import com.librasys.dto.AuthorDto;
import com.librasys.entity.Author;
import com.librasys.exception.ApiException;
import com.librasys.repository.AuthorRepository;
import com.librasys.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;

    @Autowired
    public AuthorServiceImpl(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Override
    public AuthorDto createAuthor(AuthorDto authorDto) {
        Author author = new Author();
        author.setName(authorDto.getName());
        author.setBio(authorDto.getBio());

        Author savedAuthor = authorRepository.save(author);
        return mapToDto(savedAuthor);
    }

    @Override
    public List<AuthorDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AuthorDto getAuthorById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Author not found with id: " + id));
        return mapToDto(author);
    }

    @Override
    public AuthorDto updateAuthor(Long id, AuthorDto authorDto) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Author not found with id: " + id));

        author.setName(authorDto.getName());
        author.setBio(authorDto.getBio());

        Author updatedAuthor = authorRepository.save(author);
        return mapToDto(updatedAuthor);
    }

    @Override
    public void deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Author not found with id: " + id));
        authorRepository.delete(author);
    }

    private AuthorDto mapToDto(Author author) {
        return new AuthorDto(author.getId(), author.getName(), author.getBio());
    }
}
