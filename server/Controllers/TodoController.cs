using TodoApi.Models;
using TodoApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly TodosService _todosService;

    public TodosController(TodosService todosService) =>
        _todosService = todosService;

    [HttpGet]
    public async Task<List<Todo>> Get() =>
        await _todosService.GetAsync();

    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Todo>> Get(string id)
    {
        var todo = await _todosService.GetAsync(id);

        if (todo is null)
        {
            return NotFound();
        }

        return todo;
    }

    [HttpPost]
    public async Task<IActionResult> Post(Todo newTodo)
    {
        await _todosService.CreateAsync(newTodo);
        return CreatedAtAction(nameof(Get), new { id = newTodo.Id }, newTodo);
    }

    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, Todo updatedTodo)
    {
        var todo = await _todosService.GetAsync(id);

        if (todo is null)
        {
            return NotFound();
        }

        updatedTodo.Id = todo.Id;

        await _todosService.UpdateAsync(id, updatedTodo);

        return NoContent();
    }

    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var todo = await _todosService.GetAsync(id);

        if (todo is null)
        {
            return NotFound();
        }

        await _todosService.RemoveAsync(id);

        return NoContent();
    }
}