using BlogApp.Server.Data;
using BlogApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : Controller
    {
        private readonly BlogAppDbContext _context;
        private readonly IConfiguration _configuration;

        public PostsController(BlogAppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            if (id == 0 || id == null)
            {
                return BadRequest();    
            }

            var blogPost = await _context.Posts.Include(p => p.Category).Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == id);

            if (blogPost == null)
            {
                return NotFound("Blog post not found.");
            }
            // Increment Views
            blogPost.Views = blogPost.Views + 1;
            await _context.SaveChangesAsync();

            return Ok(blogPost);
        }


        [HttpGet("trending")]
        public async Task<IActionResult> GetTrendingPosts()
        {
            // Get trending topic based on views
            var trendingPosts= await _context.Posts.Include(p => p.Category).OrderByDescending(p => p.Views).Take(5).ToListAsync();
            return Ok(trendingPosts);
        }



        [HttpGet]
        public async Task<IActionResult> GetPosts(string? searchTitle, int? pageNumber)
        {
            int pageSize = _configuration.GetValue<int?>("Pagination:PageSize") ?? 10;
            var postsQuery = _context.Posts.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrEmpty(searchTitle))
            {
                postsQuery = postsQuery.Where(p => p.Title.Contains(searchTitle));
            }
            postsQuery = postsQuery.OrderByDescending(b => b.PublishedOn);

            int totalPosts = await postsQuery.CountAsync();
            int totalPages = (int)Math.Ceiling(totalPosts / (double)pageSize);
            totalPages = totalPages < 1 ? 1 : totalPages;
            pageNumber = pageNumber.HasValue && pageNumber.Value > 0 ? pageNumber.Value : 1;
            pageNumber = pageNumber > totalPages ? totalPages : pageNumber;
            var posts = await postsQuery
                .Skip((pageNumber.Value - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(); //Execute the query to retrive only the records which required in the current page

            return Ok(new
            {
                Posts = posts,
                CurrentPage = pageNumber.Value,
                TotalPages = totalPages,
                SearchTitle = searchTitle,
            });
        }


        [HttpPost]
        public async Task<IActionResult> CreatePost(Post post)
        {
            if(ModelState.IsValid)
            {
                _context.Posts.Add(post);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetPosts), new { id = post.Id }, post);
            }

            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, Post updatedPost)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            post.Title = updatedPost.Title;
            post.Content = updatedPost.Content;
            post.CategoryId = updatedPost.CategoryId;
            post.FeaturedImage = updatedPost.FeaturedImage;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}