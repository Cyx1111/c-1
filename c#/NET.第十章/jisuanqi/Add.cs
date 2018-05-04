using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace jisuanqi
{
    public class Add:count
    {
        public int he;
        public override int Calc()
        {
            
            he = this.Left + this.Right;
            return he;
        }
    }
}
