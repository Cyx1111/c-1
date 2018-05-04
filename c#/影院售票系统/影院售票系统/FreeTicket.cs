using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 影院售票系统
{
    class FreeTicket:Ticket
    {
        public string CoustomerName { get; set; }//送票的名字
        //票价 信息 出售
        public override string CalPrice()
        {
            return null;
        }

        public override string Print()
        {
            return null;
        }

        public override string Show()
        {
            return null;
        }
    }
}
