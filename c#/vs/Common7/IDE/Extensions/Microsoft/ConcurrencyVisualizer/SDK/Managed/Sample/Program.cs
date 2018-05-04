using System;
using System.Collections.Generic;
using System.Threading;
using System.Text;
using Microsoft.ConcurrencyVisualizer.Instrumentation;

namespace MarkerSample
{
    class Program
    {
        static void Main(string[] args)
        {
            HelloWorld();

        }

        static void HelloWorld()
        {
            using (Markers.EnterSpan("Hello world, I'm a span"))
            {
                Thread.Sleep(1);
                Markers.WriteMessage("I'm a message");
                Thread.Sleep(4);
                Markers.WriteFlag("And I'm a Flag");
                Thread.Sleep(1);
            }

        }
    }
}
