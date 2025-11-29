import { TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';

interface Booking {
  id: string;
  status: string;
  payment_status: string;
  created_at: string;
  services: {
    name: string;
  };
}

interface AdminAnalyticsCardProps {
  bookings: Booking[];
}

const AdminAnalyticsCard = ({ bookings }: AdminAnalyticsCardProps) => {
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const paidBookings = bookings.filter((b) => b.payment_status === 'paid').length;

  // Calculate revenue (mock calculation)
  const estimatedRevenue = confirmedBookings * 350; // Average booking value

  // Get this month's stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.created_at);
    return (
      bookingDate.getMonth() === currentMonth &&
      bookingDate.getFullYear() === currentYear
    );
  });

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: `+${thisMonthBookings.length} this month`,
    },
    {
      title: 'Pending',
      value: pendingBookings,
      icon: TrendingUp,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      trend: 'Requires action',
    },
    {
      title: 'Confirmed',
      value: confirmedBookings,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      trend: `${paidBookings} paid`,
    },
    {
      title: 'Revenue',
      value: `$${estimatedRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: 'Estimated',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="afri-glass p-6 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminAnalyticsCard;
