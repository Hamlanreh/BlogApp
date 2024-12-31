using BlogApp.Server.Data;
using BlogApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : Controller
    {
        private readonly BlogAppDbContext _context;
        private readonly IConfiguration _configuration;

        public CategoriesController(BlogAppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories(int? id)
        {
            if (id == 0 || id == null)
            {
                return Ok(await _context.Categories.Include(p => p.Posts).ToListAsync());
            }

            return Ok(await _context.Categories.FirstOrDefaultAsync(c => c.Id == id));
        }

        [HttpGet("{id}/posts")]
        public async Task<ActionResult<IEnumerable<Post>>> GetCategoryPosts(int id, int? pageNumber)
        {
            int pageSize = _configuration.GetValue<int?>("Pagination:PageSize") ?? 10;

            var categoryPostsQuery = _context.Categories
                .Include(c => c.Posts)
                .AsQueryable();

            int totalPosts = await categoryPostsQuery.CountAsync();
            int totalPages = (int)Math.Ceiling(totalPosts / (double)pageSize);
            totalPages = totalPages < 1 ? 1 : totalPages;
            pageNumber = pageNumber.HasValue && pageNumber.Value > 0 ? pageNumber.Value : 1;
            pageNumber = pageNumber > totalPages ? totalPages : pageNumber;
            
            var category = await categoryPostsQuery
                .Skip((pageNumber.Value - 1) * pageSize)
                .Take(pageSize)
                .FirstOrDefaultAsync(c => c.Id == id); //Execute the query to retrive only the records which required in the current page

            return Ok(new
            {
                Category = category,
                CurrentPage = pageNumber.Value,
                TotalPages = totalPosts,
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, Category updatedCategory)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            category.Name = updatedCategory.Name;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
