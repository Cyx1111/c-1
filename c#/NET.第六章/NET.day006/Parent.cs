using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NET.day006
{
    class Parent
    {
        public int Score { get; set; }
        public string Name { get; set; }

        public Parent() 
        {
        }

        public Parent( string name,int score)
        {
            this.Score = score;
            this.Name = name;
        }
    }
}
