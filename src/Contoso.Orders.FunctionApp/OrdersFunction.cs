using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Contoso.Orders.FunctionApp.Model;
using System.Collections.Generic;
using System.Linq;

namespace Contoso.Orders.FunctionApp
{
    /// <summary>
    /// Actual Orders function
    /// </summary>
    public class OrdersFunction
    {
        /// <summary>
        /// Fake list of orders for the sake of demo purposes
        /// </summary>
        public static readonly List<Order> Orders;

        static OrdersFunction()
        {
            #region Generate 10 random orders

            Orders = new List<Order>();

            var rnd = new Random(DateTime.Now.Millisecond);

            Orders.AddRange(
                from o in Enumerable.Range(1, 10)
                    select new Order
                    {
                        Id = $"ORD{o.ToString("000")}-{DateTime.Now.Year}",
                        Date = DateTime.Now.AddDays(-1 * rnd.Next(1, 20)),
                        CustomerId = $"C{(o + 25).ToString("000")}",
                        Status = 
                            o % 2 == 0 ? OrderStatus.Inserted :
                            o % 3 == 0 ? OrderStatus.Processed :
                            o % 5 == 0 ? OrderStatus.Shipped :
                            OrderStatus.Closed,
                        Items = (
                            from i in Enumerable.Range(1, rnd.Next(1, 5))
                                 select new OrderItem
                                 {
                                     Id = i,
                                     ProductId = $"P{(i + rnd.Next(1, 100)).ToString("000")}",
                                     Quantity = rnd.Next(1, 100),
                                     Price = rnd.Next(1, 20) * 100
                                 }
                                 ).ToList()
                    }
            );

            #endregion
        }

        /// <summary>
        /// Provides the list of orders
        /// </summary>
        /// <param name="req">The request</param>
        /// <param name="log">The logging interface</param>
        /// <returns>The list of orders</returns>
        [FunctionName("GetOrders")]
        public IActionResult GetOrders(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "orders")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation($"GetOrders invoked.");

            return new OkObjectResult(Orders);
        }

        /// <summary>
        /// Provides a specific order
        /// </summary>
        /// <param name="req">The request</param>
        /// <param name="log">The logging interface</param>
        /// <param name="id">The ID of the order to retrieve</param>
        /// <returns>The retrieved order, if any</returns>
        [FunctionName("GetOrder")]
        public IActionResult GetOrder(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "orders/{id}")] HttpRequest req,
            ILogger log,
            string id)
        {
            log.LogInformation($"GetOrder invoked for order: {id}.");

            var order = Orders.FirstOrDefault(o => o.Id == id);
            if (order != null)
            {
                return new OkObjectResult(order);
            }
            else
            {
                return new NotFoundResult();
            }
        }

        /// <summary>
        /// Adds a new order
        /// </summary>
        /// <param name="req">The request</param>
        /// <param name="log">The logging interface</param>
        /// <returns>The inserted order</returns>
        [FunctionName("AddOrder")]
        public async Task<IActionResult> AddOrder(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "orders")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation($"AddOrder invoked.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var newOrder = JsonConvert.DeserializeObject<Order>(requestBody);

            Orders.Add(newOrder);

            return new OkObjectResult(newOrder);
        }

        /// <summary>
        /// Updates a specific order
        /// </summary>
        /// <param name="req">The request</param>
        /// <param name="log">The logging interface</param>
        /// <param name="id">The ID of the order to update</param>
        /// <returns>The updated order, if any</returns>
        [FunctionName("UpdateOrder")]
        public async Task<IActionResult> UpdateOrder(
            [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "orders/{id}")] HttpRequest req,
            ILogger log,
            string id)
        {
            log.LogInformation($"UpdateOrder invoked for order: {id}.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var updatedOrder = JsonConvert.DeserializeObject<Order>(requestBody);

            var orderToUpdate = Orders.FindIndex(o => o.Id == updatedOrder.Id);
            if (orderToUpdate >= 0)
            {
                Orders[orderToUpdate] = updatedOrder;
                return new OkObjectResult(updatedOrder);
            }
            else
            {
                return new NotFoundResult();
            }
        }

        /// <summary>
        /// Deletes a specific order
        /// </summary>
        /// <param name="req">The request</param>
        /// <param name="log">The logging interface</param>
        /// <param name="id">The ID of the order to delete</param>
        [FunctionName("DeleteOrder")]
        public IActionResult DeleteOrder(
            [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "orders/{id}")] HttpRequest req,
            ILogger log,
            string id)
        {
            log.LogInformation($"DeleteOrder invoked for order: {id}.");

            var orderToDelete = Orders.FindIndex(o => o.Id == id);
            if (orderToDelete >= 0)
            {
                Orders.RemoveAt(orderToDelete);
                return new OkResult();
            }
            else
            {
                return new NotFoundResult();
            }
        }
    }
}
