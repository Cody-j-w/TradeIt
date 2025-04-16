# This makes data_fetchers a Python package

# muhahah just learned how to make this a package

# now instead of having ace import it like:
#    from data_fetchers.grab_posts_by_recent_week import get_recent_posts_by_week

# he can now import it like:
#    from data_fetchers import get_recent_posts_by_week


# from .grab_followers_by_user import get_recent_followers_by_user
from .grab_posts_by_zipcode import get_recent_posts_by_zipcode
from .grab_posts_by_liked_profiles import get_recent_posts_by_liked_profiles
from .grab_posts_by_recent_week import get_recent_posts_by_week
# from .grab_tags_by_liked_posts_weighted import get_weighted_tags_from_liked_posts

# To be reimplimented when features are finished
# __all__ = [
#     "get_recent_followers_by_user",
#     "get_recent_posts_by_zipcode",
#     "get_recent_posts_by_liked_profiles",
#     "get_recent_posts_by_week",
#     "get_weighted_tags_from_liked_posts",
# ]

__all__ = [
    "get_recent_posts_by_zipcode",
    "get_recent_posts_by_liked_profiles",
    "get_recent_posts_by_week",
]
