export const PlacesApi = {
  getById: function(id: number) {
    return `You gave me ${id}`
  },
  create: function() {
    return '43'
  },
  update: function(id: number, body: any) {
    return '44'
  },
  delete: function(id: number) {
    return '45'
  },
  list: function() {
    return '46'
  }
}
