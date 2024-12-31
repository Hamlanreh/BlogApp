using BlogApp.Server.Data;
using BlogApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BlogApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : Controller
    {
        private readonly BlogAppDbContext _context;

        public CommentsController(BlogAppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{postId}")]
        public async Task<IEnumerable<Comment>> GetComments(int postId)
        {
            return await _context.Comments.Where(p => p.PostId == postId).ToListAsync();            
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment(Comment comment)
        {
            if (ModelState.IsValid)
            {
                Console.WriteLine(comment);
                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetComments), new { postId = comment.PostId }, comment);
            }
            return BadRequest();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, Comment updatedComment)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            comment.Author = updatedComment.Author;
            comment.Text = updatedComment.Text;
            comment.PostId = updatedComment.PostId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
